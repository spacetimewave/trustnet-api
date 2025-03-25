import Nano, { MangoResponse } from "nano";
import { IDnsProvider } from "@spacetimewave/trustnet-engine";
import { AutoMap } from "../common/Mapper";

export class DnsMarketplaceRepository {
  public dbEndpoint: string;
  public dbName: string;
  public dbUser: string;
  public dbPassword: string;

  constructor(
    dbEndpoint: string,
    dbName: string,
    dbUser: string,
    dbPassword: string
  ) {
    this.dbEndpoint = dbEndpoint;
    this.dbName = dbName;
    this.dbUser = dbUser;
    this.dbPassword = dbPassword;
  }

  async createDnsProvider(dnsProvider: IDnsProvider) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      // database.db.create(this.dbName);
      const table = database.db.use(this.dbName);
      const response = await table.insert({ ...dnsProvider, _id: undefined }); // null id (assigned by CouchDB)
      return response;
    } catch (error) {
      //   throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async getDnsProvider(search: string): Promise<IDnsProvider[] | undefined> {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.dbName);
      const response = (await table.find({
        selector: {},
      })) as MangoResponse<IDnsProvider[] | undefined>;
      if (response.docs.length === 0) {
        return undefined;
      }

      const docs = response.docs;
      const dnsProviders: IDnsProvider[] = [];

      for (const doc of docs) {
        dnsProviders.push(AutoMap(doc, {} as IDnsProvider));
      }

      return dnsProviders;
    } catch (error: unknown) {
      throw new Error();
    }
  }

  // async checkDnsExtensionAvailability(domainName: string): Promise<boolean> {
  // const user = this.getDnsEntryByName(domainName);
  // return user === undefined;
  // }

  async updateDnsProvider(dnsProvider: IDnsProvider) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.dbName);
      const response = (await table.find({
        selector: {},
      })) as MangoResponse<IDnsProvider | undefined>;
      if (response.docs.length === 0) {
        throw new Error("Document not found");
      }

      const doc = response.docs[0];
      const updatedEntry = { ...doc, ...dnsProvider };
      const updateResponse = await table.insert(updatedEntry);
      return updateResponse;
    } catch (error) {
      throw new Error(`Error updating document`);
    }
  }

  async deleteDnsProvider(dnsExtension: string) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.dbName);
      const response = (await table.find({
        selector: { dnsExtension: dnsExtension },
      })) as MangoResponse<IDnsProvider | undefined>;
      if (response.docs.length === 0) {
        throw new Error("Document not found");
      }

      const doc = response.docs[0];
      const deleteResponse = await table.destroy(doc._id, doc._rev);
      return deleteResponse;
    } catch (error) {
      throw new Error(`Error deleting document`);
    }
  }
}
