import express from "express";
import { IDnsRecord, IDnsRecordMessage } from "@spacetimewave/trustnet-engine";
export const router = express.Router();

router.get(
  "/api/v1/dns/:domainName",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const dnsEntry: IDnsRecord | undefined =
      await req.dnsRepository.getDnsEntryByName(req.params.domainName);

    if (dnsEntry === undefined) {
      res.sendStatus(404);
      return;
    }

    res.json(dnsEntry);
  }
);

router.post(
  "/api/v1/dns/:domainName",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsRecordMessage: IDnsRecordMessage = req.body;
    const dnsRecord: IDnsRecord = dnsRecordMessage.content;

    if (
      !dnsRecord.domainName ||
      !dnsRecord.accountPublicKey ||
      !dnsRecord.hostingProviderAddresses ||
      !Array.isArray(dnsRecord.hostingProviderAddresses)
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    await req.dnsRepository.createDnsName(dnsRecordMessage.content);

    res.sendStatus(201);
  }
);

router.put(
  "/api/v1/dns/:domainName",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsRecordMessage: IDnsRecordMessage = req.body;
    const dnsRecord: IDnsRecord = dnsRecordMessage.content;

    if (
      !dnsRecord.domainName ||
      !dnsRecord.accountPublicKey ||
      !dnsRecord.hostingProviderAddresses ||
      !Array.isArray(dnsRecord.hostingProviderAddresses)
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const existingDnsRecord = await req.dnsRepository.getDnsEntryByName(
      req.params.username
    );

    if (existingDnsRecord === undefined) {
      res.sendStatus(404);
      return;
    }

    await req.dnsRepository.updateDnsEntry(dnsRecord.domainName, {
      ...existingDnsRecord,
      ...dnsRecord,
    });

    res.sendStatus(200);
  }
);

router.delete(
  "/api/v1/dns/:domainName",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsRecordMessage: IDnsRecordMessage = req.body;
    const dnsRecord: IDnsRecord = dnsRecordMessage.content;
    await req.dnsRepository.deleteDnsEntry(req.params.domainName);

    res.sendStatus(200);
  }
);
