import dotenv from "dotenv";
import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { DnsRepository } from "./repositories/DnsRepository";
import { router as indexRouter } from "./routes/index";

dotenv.config({ path: __dirname + "/.env.localhost" });
var app = express();

app.set("port", "3000");

console.log(process.env.COUCHDB_URL);

const dnsRepository = new DnsRepository(
  process.env.COUCHDB_URL ?? "",
  process.env.DNS_DATABASE_NAME ?? "",
  process.env.COUCHDB_USER ?? "",
  process.env.COUCHDB_PSWD ?? ""
);

// Middleware to inject dbRepository into req
declare global {
  namespace Express {
    interface Request {
      dnsRepository: DnsRepository;
    }
  }
}

app.use((req, res, next) => {
  req.dnsRepository = dnsRepository;
  next();
});

app.use(cors());
//app.use(cors({origin: 'http://localhost:3000'}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

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
