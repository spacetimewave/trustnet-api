import Nano, { MangoResponse } from "nano";
import { IDnsRecord } from "@spacetimewave/trustnet-engine";

export class DnsRepository {
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

  async createDnsRecord(dnsRecord: IDnsRecord) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      // database.db.create(this.dbName);
      const table = database.db.use(this.dbName);
      const response = await table.insert({ ...dnsRecord, _id: undefined }); // null id (assigned by CouchDB)
      return response;
    } catch (error) {
      //   throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async getDnsEntryByName(domainName: string): Promise<IDnsRecord | undefined> {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.dbName);
      const response = (await table.find({
        selector: { domainName: domainName },
      })) as MangoResponse<IDnsRecord | undefined>;
      if (response.docs.length === 0) {
        return undefined;
      }

      const doc = response.docs[0];
      const dnsRecord: IDnsRecord = {
        domainName: doc.domainName,
        accountPublicKey: doc.accountPublicKey,
        hostingProviderAddresses: doc.hostingProviderAddresses,
      };

      return dnsRecord;
    } catch (error: unknown) {
      throw new Error();
    }
  }

  async checkDnsNameAvailability(domainName: string): Promise<boolean> {
    const user = this.getDnsEntryByName(domainName);
    return user === undefined;
  }

  async updateDnsEntry(domainName: string, dnsRecord: Partial<IDnsRecord>) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.dbName);
      const response = (await table.find({
        selector: { domainName: domainName },
      })) as MangoResponse<IDnsRecord | undefined>;
      if (response.docs.length === 0) {
        throw new Error("Document not found");
      }

      const doc = response.docs[0];
      const updatedEntry = { ...doc, ...dnsRecord };
      const updateResponse = await table.insert(updatedEntry);
      return updateResponse;
    } catch (error) {
      throw new Error(`Error updating document`);
    }
  }

  async deleteDnsEntry(domainName: string) {
    try {
      let database = Nano(this.dbEndpoint);
      await database.auth(this.dbUser, this.dbPassword);
      const table = database.db.use(this.dbName);
      const response = (await table.find({
        selector: { domainName: domainName },
      })) as MangoResponse<IDnsRecord | undefined>;
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
