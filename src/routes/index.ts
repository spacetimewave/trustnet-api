import express from "express";
export const router = express.Router();

router.get(
  "/api/v1/dns/search/username/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    await req.dnsRepository.createDnsName({
      id: 1,
      name: "test.stw",
      urls: ["http://test.com"],
      ips: [],
    });
    let account = { seed: "1234" };
    if (account === undefined) {
      res.sendStatus(404);
      return;
    }
    res.json(account);
  }
);
