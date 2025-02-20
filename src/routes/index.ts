import express from "express";
import {
  IDnsRecord,
  ICreateDnsRecordMessage,
  IDeleteDnsRecordMessage,
  IGetDnsRecordMessage,
  IUpdateDnsRecordMessage,
} from "@spacetimewave/trustnet-engine";
export const router = express.Router();

router.get(
  "/api/v1/dns/record",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const getDnsRecordMessage: IGetDnsRecordMessage = req.body;
    const dnsRecord = await req.dnsService.getDnsRecord(getDnsRecordMessage);

    if (dnsRecord === undefined) {
      res.sendStatus(404);
      return;
    }

    res.json(dnsRecord);
  }
);

router.post(
  "/api/v1/dns/record",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const createDnsRecordMessage: ICreateDnsRecordMessage = req.body;
    await req.dnsService.createDnsRecord(createDnsRecordMessage);
    res.sendStatus(201);
  }
);

router.put(
  "/api/v1/dns/record",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsRecordMessage: IUpdateDnsRecordMessage = req.body;
    const dnsRecord: IDnsRecord = dnsRecordMessage.content.dnsRecord;

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
      dnsRecord.domainName
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
  "/api/v1/dns/record",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    const dnsRecordMessage: IDeleteDnsRecordMessage = req.body;
    const domainName = dnsRecordMessage.content.domainName;
    await req.dnsRepository.deleteDnsEntry(domainName);

    res.sendStatus(200);
  }
);
