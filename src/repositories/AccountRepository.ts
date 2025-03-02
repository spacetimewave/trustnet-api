import Nano, { MangoResponse } from "nano";
import { IDnsRecord, ISeedBlock } from "@spacetimewave/trustnet-engine";
import { AutoMap } from "../common/Mapper";

export class AccountRepository {
  public dbEndpoint: string;
  public ACCOUNT_SEED_BLOCK_TABLE: string = "trustnet_account_seed_blocks";
  public ACCOUNT_BLOCKS_TABLE: string = "trustnet_account_blocks";
  public dbUser: string;
  public dbPassword: string;

  constructor(dbEndpoint: string, dbUser: string, dbPassword: string) {
    this.dbEndpoint = dbEndpoint;
    this.dbUser = dbUser;
    this.dbPassword = dbPassword;
  }

  async createAccountSeedBlock(seedBlock: ISeedBlock) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.ACCOUNT_SEED_BLOCK_TABLE);
      const response = await table.insert({ ...seedBlock, _id: undefined });
      return response;
    } catch (error) {}
  }

  async getAccountSeedBlock(
    accountPublicKey: string
  ): Promise<ISeedBlock | undefined> {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.ACCOUNT_SEED_BLOCK_TABLE);
      const response = (await table.find({
        selector: { address: accountPublicKey },
      })) as MangoResponse<IDnsRecord | undefined>;
      if (response.docs.length === 0) {
        return undefined;
      }

      const doc = response.docs[0];
      const seedBlock = AutoMap(response.docs[0], {} as ISeedBlock);
      return seedBlock;
    } catch (error: unknown) {
      throw new Error();
    }
  }
}
