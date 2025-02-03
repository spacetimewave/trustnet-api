import express from "express";
import { IDomainNameEntry } from "@spacetimewave/trustnet-engine";
export const router = express.Router();

router.get(
  "/api/v1/dns/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const dnsEntry: IDomainNameEntry | undefined =
      await req.dnsRepository.getDnsEntryByName(req.params.username);

    if (dnsEntry === undefined) {
      res.sendStatus(404);
      return;
    }

    res.json(dnsEntry);
  }
);

router.post(
  "/api/v1/dns/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsEntry: IDomainNameEntry = req.body;

    if (
      !dnsEntry.domainName ||
      !dnsEntry.domainIPs ||
      !dnsEntry.domainUrls ||
      !Array.isArray(dnsEntry.domainIPs) ||
      !Array.isArray(dnsEntry.domainUrls)
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    await req.dnsRepository.createDnsName(dnsEntry);

    res.sendStatus(201);
  }
);

router.put(
  "/api/v1/dns/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsEntry: IDomainNameEntry = req.body;

    if (
      !dnsEntry.domainName ||
      !dnsEntry.domainIPs ||
      !dnsEntry.domainUrls ||
      !Array.isArray(dnsEntry.domainIPs) ||
      !Array.isArray(dnsEntry.domainUrls)
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const existingEntry = await req.dnsRepository.getDnsEntryByName(
      req.params.username
    );

    if (existingEntry === undefined) {
      res.sendStatus(404);
      return;
    }

    await req.dnsRepository.updateDnsEntry(dnsEntry.domainName, {
      ...existingEntry,
      ...dnsEntry,
    });

    res.sendStatus(200);
  }
);

router.delete(
  "/api/v1/dns/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    await req.dnsRepository.deleteDnsEntry(req.params.username);

    res.sendStatus(200);
  }
);
