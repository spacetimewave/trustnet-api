import {
  Account,
  Core,
  ICreateDnsProviderInMarketplaceMessage,
  IGetDnsProvidersFromMarketplaceMessage,
  IGetDnsProvidersFromMarketplaceUnauthenticatedMessage,
} from "@spacetimewave/trustnet-engine";
import { DnsMarketplaceRepository } from "../repositories/DnsMarketplaceRepository";

export class DnsMarketplaceService {
  private dnsMarketplaceRepository: DnsMarketplaceRepository;

  constructor(dnsMarketplaceRepository: DnsMarketplaceRepository) {
    this.dnsMarketplaceRepository = dnsMarketplaceRepository;
  }

  async getDnsProviders(
    getDnsProviderMessage: IGetDnsProvidersFromMarketplaceMessage
  ) {
    const valid = await Account.verifyMessage(getDnsProviderMessage);
    if (!valid) {
      throw new Error("Invalid message");
    }
    const search = getDnsProviderMessage.content.search;
    return await this.dnsMarketplaceRepository.getDnsProvider(search);
  }

  async getDnsProvidersWithoutAuth(
    getDnsProviderMessage: IGetDnsProvidersFromMarketplaceUnauthenticatedMessage
  ) {
    const search = getDnsProviderMessage.content.search;
    return await this.dnsMarketplaceRepository.getDnsProvider(search);
  }

  async createDnsProvider(
    createDnsRecordMessage: ICreateDnsProviderInMarketplaceMessage
  ) {
    const valid = await Account.verifyMessage(createDnsRecordMessage);
    if (!valid) {
      throw new Error("Invalid message");
    }
    const dnsProvider = createDnsRecordMessage.content.dnsProvider;
    await this.dnsMarketplaceRepository.createDnsProvider(dnsProvider);
    return createDnsRecordMessage.content.dnsProvider;
  }
}
