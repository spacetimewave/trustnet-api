import express from "express";
import DnsEntry from "../models/DnsEntry";
export const router = express.Router();

router.get(
  "/api/v1/dns/search/username/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const dnsEntry: DnsEntry | undefined =
      await req.dnsRepository.getDnsEntryByName(req.params.username);

    if (dnsEntry === undefined) {
      res.sendStatus(404);
      return;
    }

    res.json(dnsEntry);
  }
);

router.post(
  "/api/v1/dns/create",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsEntry: DnsEntry = req.body;

    if (
      !dnsEntry.name ||
      !dnsEntry.urls ||
      !Array.isArray(dnsEntry.urls) ||
      !Array.isArray(dnsEntry.ips)
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    await req.dnsRepository.createDnsName(dnsEntry);

    res.sendStatus(201);
  }
);
