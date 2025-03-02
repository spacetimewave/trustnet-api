import {
  Account,
  ICreateDnsRecordMessage,
  IGetDnsRecordMessage,
} from "@spacetimewave/trustnet-engine";
import { DnsRepository } from "../repositories/DnsRepository";

export class DnsService {
  private dnsRepository: DnsRepository;

  constructor(dnsRepository: DnsRepository) {
    this.dnsRepository = dnsRepository;
  }

  async getDnsRecord(getDnsRecordMessage: IGetDnsRecordMessage) {
    const valid = await Account.verifyMessage(getDnsRecordMessage);
    if (!valid) {
      throw new Error("Invalid message");
    }
    const domainName = getDnsRecordMessage.content.domainName;
    return await this.dnsRepository.getDnsEntryByName(domainName);
  }

  async getDnsRecordWithoutAuth(getDnsRecordMessage: IGetDnsRecordMessage) {
    const domainName = getDnsRecordMessage.content.domainName;
    return await this.dnsRepository.getDnsEntryByName(domainName);
  }

  async createDnsRecord(createDnsRecordMessage: ICreateDnsRecordMessage) {
    const valid = await Account.verifyMessage(createDnsRecordMessage);
    if (!valid) {
      throw new Error("Invalid message");
    }
    const dnsRecord = createDnsRecordMessage.content.dnsRecord;
    await this.dnsRepository.createDnsRecord(dnsRecord);
  }
}
