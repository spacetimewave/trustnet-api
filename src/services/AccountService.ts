import {
  Account,
  ICreateAccountSeedBlockMessage,
  IGetAccountSeedBlockMessage,
  IGetAccountSeedBlockUnauthenticatedMessage,
} from "@spacetimewave/trustnet-engine";
import { AccountRepository } from "../repositories/AccountRepository";

export class AccountService {
  private accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  public async getAccountSeedBlock(
    getAccountSeedBlockMessage: IGetAccountSeedBlockMessage
  ) {
    const valid = await Account.verifyMessage(getAccountSeedBlockMessage);
    if (!valid) {
      throw new Error("Invalid message");
    }
    const accountPubKey = getAccountSeedBlockMessage.content.accountPublicKey;
    return await this.accountRepository.getAccountSeedBlock(accountPubKey);
  }

  public async getAccountSeedBlockUnauthenticated(
    getAccountSeedBlockMessage: IGetAccountSeedBlockUnauthenticatedMessage
  ) {
    const accountPubKey = getAccountSeedBlockMessage.content.accountPublicKey;
    return await this.accountRepository.getAccountSeedBlock(accountPubKey);
  }

  public async createAccountSeedBlock(
    createAccountSeedBlockMessage: ICreateAccountSeedBlockMessage
  ) {
    const seedBlock = createAccountSeedBlockMessage.content.seedBlock;
    const valid = await Account.verifySeedBlock(seedBlock);
    if (!valid) {
      throw new Error("Invalid message");
    }
    await this.accountRepository.createAccountSeedBlock(seedBlock);
    return seedBlock;
  }
}
