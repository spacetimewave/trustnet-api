import express from "express";
import {
  ICreateAccountSeedBlockMessage,
  IGetAccountSeedBlockMessage,
  IGetAccountSeedBlockUnauthenticatedMessage,
} from "@spacetimewave/trustnet-engine";
export const router = express.Router();

router.post(
  "/api/v1/account/seed/get",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.query.auth) {
      const getAccountSeedBlockMessage: IGetAccountSeedBlockMessage = req.body;
      const seedBlock = await req.accountService.getAccountSeedBlock(
        getAccountSeedBlockMessage
      );
      res.json(seedBlock);
    } else {
      const getAccountSeedBlockMessage: IGetAccountSeedBlockUnauthenticatedMessage =
        req.body;
      const seedBlock =
        await req.accountService.getAccountSeedBlockUnauthenticated(
          getAccountSeedBlockMessage
        );
      res.json(seedBlock);
    }
  }
);

router.post(
  "/api/v1/account/seed/create",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const createAccountSeedBlockMessage: ICreateAccountSeedBlockMessage =
      req.body;

    const seedBlock = await req.accountService.createAccountSeedBlock(
      createAccountSeedBlockMessage
    );
    res.json(seedBlock);
  }
);

// router.post(
//   "/api/v1/account/seed/update",
//   async function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // const getSeedBlock = req.body;

//     const auth = req.query.auth === "false";

//     const seedBlock = {
//       version: 1,
//       address:
//         "0x0004003e0005007a001500c200b200740025007300ef00b1009900af00d4006800a800270074006800da009c008000e00069008700fc0059005a000e00f3001d00aa0029005500a400dc006000e9003900a5008f00140098002300dc00b600e000c1009c000e000900d5001800d800e3008f0061007e00470034003f007f0005007f",
//       public_key:
//         "0x000400e1009400a5007900620029009a00f1007f00a900bb005200b900b70045002a0034009b004a00b8008e004000c500e200860001000f00b0005100010016006100ed004c00050001002c00ad008700d6005700000025009a00e3005c00780099004b007e003400b700b5003d00cc00a3007100b200af005500d7005a0000009d",
//       update_id: 1,
//       signature:
//         "0x00be00d40099003b002f00b9009000dd0069002500a30012002e007700ef00620075008e006000250084003900780071000a002f006500df00eb002800d7006300bc00dc003e00a4002600fb00ca00b8000500cd00e600a600f20090004200cf007f00ca00c400b20062003d00f3009d00ee00b5002e00ea009d009b00670008",
//     };

//     res.json(seedBlock);
//   }
// );

// router.post(
//   "/api/v1/account/seed/delete",
//   async function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // const getSeedBlock = req.body;

//     const auth = req.query.auth === "false";

//     const seedBlock = {
//       version: 1,
//       address:
//         "0x0004003e0005007a001500c200b200740025007300ef00b1009900af00d4006800a800270074006800da009c008000e00069008700fc0059005a000e00f3001d00aa0029005500a400dc006000e9003900a5008f00140098002300dc00b600e000c1009c000e000900d5001800d800e3008f0061007e00470034003f007f0005007f",
//       public_key:
//         "0x000400e1009400a5007900620029009a00f1007f00a900bb005200b900b70045002a0034009b004a00b8008e004000c500e200860001000f00b0005100010016006100ed004c00050001002c00ad008700d6005700000025009a00e3005c00780099004b007e003400b700b5003d00cc00a3007100b200af005500d7005a0000009d",
//       update_id: 1,
//       signature:
//         "0x00be00d40099003b002f00b9009000dd0069002500a30012002e007700ef00620075008e006000250084003900780071000a002f006500df00eb002800d7006300bc00dc003e00a4002600fb00ca00b8000500cd00e600a600f20090004200cf007f00ca00c400b20062003d00f3009d00ee00b5002e00ea009d009b00670008",
//     };

//     res.json(seedBlock);
//   }
// );

// router.post(
//   "/api/v1/account/block/get",
//   async function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // const getBlock = req.body;

//     // const last = req.query.last === "false"; // false: get last block, true: get block

//     const block = {};

//     res.json(block);
//   }
// );

// router.post(
//   "/api/v1/account/block/create",
//   async function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // const createBlock = req.body;

//     const block = {};

//     res.json(block);
//   }
// );

// router.post(
//   "/api/v1/account/block/update",
//   async function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // const updateBlock = req.body;

//     const block = {};

//     res.json(block);
//   }
// );

// router.post(
//   "/api/v1/account/block/delete",
//   async function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     // const deleteBlock = req.body;

//     const block = {};

//     res.json(block);
//   }
// );
