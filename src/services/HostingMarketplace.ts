import {
  Account,
  Core,
  ICreateHostingProviderInMarketplaceMessage,
  IGetHostingProvidersFromMarketplaceMessage,
  IGetHostingProvidersFromMarketplaceUnauthenticatedMessage,
} from "@spacetimewave/trustnet-engine";
import { HostingMarketplaceRepository } from "../repositories/HostingMarketplaceRepository";

export class HostingMarketplaceService {
  private hostingMarketplaceRepository: HostingMarketplaceRepository;

  constructor(hostingMarketplaceRepository: HostingMarketplaceRepository) {
    this.hostingMarketplaceRepository = hostingMarketplaceRepository;
  }

  async getHostingProviders(
    getHostingProviderMessage: IGetHostingProvidersFromMarketplaceMessage
  ) {
    const valid = await Account.verifyMessage(getHostingProviderMessage);
    if (!valid) {
      throw new Error("Invalid message");
    }
    const search = getHostingProviderMessage.content.search;
    return await this.hostingMarketplaceRepository.getHostingPovider(search);
  }

  async getHostingProvidersWithoutAuth(
    getHostingProviderMessage: IGetHostingProvidersFromMarketplaceUnauthenticatedMessage
  ) {
    const search = getHostingProviderMessage.content.search;
    return await this.hostingMarketplaceRepository.getHostingPovider(search);
  }

  async createHostingProvider(
    createHostingRecordMessage: ICreateHostingProviderInMarketplaceMessage
  ) {
    const valid = await Account.verifyMessage(createHostingRecordMessage);

    if (!valid) {
      throw new Error("Invalid message");
    }
    const hostingProvider = createHostingRecordMessage.content.hostingProvider;
    await this.hostingMarketplaceRepository.createHostingProvider(
      hostingProvider
    );
    return hostingProvider;
  }
}
