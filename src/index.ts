import dotenv from "dotenv";
import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import { router as dnsRouter } from "./routes/dns";
import { router as accountRouter } from "./routes/account";
import { router as dnsMarketplaceRouter } from "./routes/dnsMarketplace";
import { router as hostingMarketplaceRouter } from "./routes/hostingMarketplace";

import { DnsRepository } from "./repositories/DnsRepository";
import { DnsService } from "./services/DnsService";
import { AccountRepository } from "./repositories/AccountRepository";
import { AccountService } from "./services/AccountService";
import { DnsMarketplaceRepository } from "./repositories/DnsMarketplaceRepository";
import { DnsMarketplaceService } from "./services/DnsMarketplace";
import { HostingMarketplaceRepository } from "./repositories/HostingMarketplaceRepository";
import { HostingMarketplaceService } from "./services/HostingMarketplace";

dotenv.config({ path: __dirname + "/.env.localhost" });
var app = express();
app.set("port", "3000");

// Repositories and Services
const dnsRepository = new DnsRepository(
  process.env.COUCHDB_URL ?? "",
  process.env.DNS_DATABASE_NAME ?? "",
  process.env.COUCHDB_USER ?? "",
  process.env.COUCHDB_PSWD ?? ""
);
const dnsMarketplaceRepository = new DnsMarketplaceRepository(
  process.env.COUCHDB_URL ?? "",
  process.env.DNS_PROVIDERS_DATABASE_NAME ?? "",
  process.env.COUCHDB_USER ?? "",
  process.env.COUCHDB_PSWD ?? ""
);

const hostingMarketplaceRepository = new HostingMarketplaceRepository(
  process.env.COUCHDB_URL ?? "",
  process.env.HOSTING_PROVIDERS_DATABASE_NAME ?? "",
  process.env.COUCHDB_USER ?? "",
  process.env.COUCHDB_PSWD ?? ""
);
const accountRepository = new AccountRepository(
  process.env.COUCHDB_URL ?? "",
  process.env.ACCOUNT_SEED_BLOCKS_DATABASE_NAME ?? "",
  process.env.COUCHDB_USER ?? "",
  process.env.COUCHDB_PSWD ?? ""
);

const dnsService = new DnsService(dnsRepository);
const accountService = new AccountService(accountRepository);
const dnsMarketplaceService = new DnsMarketplaceService(
  dnsMarketplaceRepository
);
const hostingMarketplaceService = new HostingMarketplaceService(
  hostingMarketplaceRepository
);
// Dependency Injection Middleware
declare global {
  namespace Express {
    interface Request {
      dnsRepository: DnsRepository;
      dnsService: DnsService;
      dnsMarketplaceRepository: DnsMarketplaceRepository;
      dnsMarketplaceService: DnsMarketplaceService;
      hostingMarketplaceRepository: HostingMarketplaceRepository;
      hostingMarketplaceService: HostingMarketplaceService;
      accountRepository: AccountRepository;
      accountService: AccountService;
    }
  }
}

app.use((req, res, next) => {
  req.dnsRepository = dnsRepository;
  req.dnsService = dnsService;
  req.dnsMarketplaceRepository = dnsMarketplaceRepository;
  req.dnsMarketplaceService = dnsMarketplaceService;
  req.hostingMarketplaceRepository = hostingMarketplaceRepository;
  req.hostingMarketplaceService = hostingMarketplaceService;
  req.accountRepository = accountRepository;
  req.accountService = accountService;
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", dnsRouter);
app.use("/", dnsMarketplaceRouter);
app.use("/", hostingMarketplaceRouter);
app.use("/", accountRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
