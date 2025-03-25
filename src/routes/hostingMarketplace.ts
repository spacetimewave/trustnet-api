import express from "express";
import {
  ICreateHostingProviderInMarketplaceMessage,
  IGetHostingProvidersFromMarketplaceUnauthenticatedMessage,
} from "@spacetimewave/trustnet-engine";
export const router = express.Router();

router.post(
  "/api/v1/hosting/marketplace/get",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const getHostingProviderMessage: IGetHostingProvidersFromMarketplaceUnauthenticatedMessage =
      req.body;

    const hostingProviders =
      await req.hostingMarketplaceService.getHostingProvidersWithoutAuth(
        getHostingProviderMessage
      );

    if (hostingProviders === null) {
      res.status(404).send("Seed block not found");
      return;
    }
    res.status(200).json(hostingProviders);
  }
);

router.post(
  "/api/v1/hosting/marketplace/create",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const createHostingProviderMessage: ICreateHostingProviderInMarketplaceMessage =
      req.body;

    const hostingProvider =
      await req.hostingMarketplaceService.createHostingProvider(
        createHostingProviderMessage
      );
    res.status(201).json(hostingProvider);
  }
);
