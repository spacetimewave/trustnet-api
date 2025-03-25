import express from "express";
import {
  ICreateAccountSeedBlockMessage,
  ICreateDnsProviderInMarketplaceContent,
  ICreateDnsProviderInMarketplaceMessage,
  IGetAccountSeedBlockMessage,
  IGetAccountSeedBlockUnauthenticatedMessage,
  IGetDnsProvidersFromMarketplaceUnauthenticatedMessage,
} from "@spacetimewave/trustnet-engine";
export const router = express.Router();

router.post(
  "/api/v1/dns/marketplace/get",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const getDnsProviderMessage: IGetDnsProvidersFromMarketplaceUnauthenticatedMessage =
      req.body;

    const dnsProviders =
      await req.dnsMarketplaceService.getDnsProvidersWithoutAuth(
        getDnsProviderMessage
      );

    if (dnsProviders === null) {
      res.status(404).send("Seed block not found");
      return;
    }
    res.status(200).json(dnsProviders);
  }
);

router.post(
  "/api/v1/dns/marketplace/create",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const createDnsProviderMessage: ICreateDnsProviderInMarketplaceMessage =
      req.body;

    const dnsProvider = await req.dnsMarketplaceService.createDnsProvider(
      createDnsProviderMessage
    );

    res.status(201).json(dnsProvider);
  }
);
