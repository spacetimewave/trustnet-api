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

  async createDnsName(dnsRecord: IDnsRecord) {
    try {
      console.log("createDnsName");
      console.log(this.dbEndpoint);
      let database = Nano(this.dbEndpoint);
      console.log("authenticating");
      await database.auth(this.dbUser, this.dbPassword);
      console.log("creating database");
      // database.db.create(this.dbName);
      console.log("using database");
      const table = database.db.use(this.dbName);
      console.log("inserting document");
      const response = await table.insert({ ...dnsRecord, _id: undefined }); // null id (assigned by CouchDB)
      console.log("document inserted");
      return response;
    } catch (error) {
      //   throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async getDnsEntryByName(domainName: string): Promise<IDnsRecord | undefined> {
    try {
      console.log("getDnsEntryByName");
      console.log(this.dbEndpoint);
      let database = Nano(this.dbEndpoint);
      console.log("authenticating");
      await database.auth(this.dbUser, this.dbPassword);
      console.log("using database");
      const table = database.db.use(this.dbName);
      console.log("finding document");
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
      console.log("updateDnsEntry");
      console.log(this.dbEndpoint);
      let database = Nano(this.dbEndpoint);
      console.log("authenticating");
      await database.auth(this.dbUser, this.dbPassword);
      console.log("using database");
      const table = database.db.use(this.dbName);
      console.log("finding document");
      const response = (await table.find({
        selector: { domainName: domainName },
      })) as MangoResponse<IDnsRecord | undefined>;
      if (response.docs.length === 0) {
        throw new Error("Document not found");
      }

      const doc = response.docs[0];
      console.log(doc);
      const updatedEntry = { ...doc, ...dnsRecord };
      console.log("updating document");
      console.log(updatedEntry);
      const updateResponse = await table.insert(updatedEntry);
      console.log("document updated");
      return updateResponse;
    } catch (error) {
      throw new Error(`Error updating document`);
    }
  }

  async deleteDnsEntry(domainName: string) {
    try {
      console.log("deleteDnsEntry");
      console.log(this.dbEndpoint);
      let database = Nano(this.dbEndpoint);
      console.log("authenticating");
      await database.auth(this.dbUser, this.dbPassword);
      console.log("using database");
      const table = database.db.use(this.dbName);
      console.log("finding document");
      const response = (await table.find({
        selector: { domainName: domainName },
      })) as MangoResponse<IDnsRecord | undefined>;
      if (response.docs.length === 0) {
        throw new Error("Document not found");
      }

      const doc = response.docs[0];
      console.log("deleting document");
      const deleteResponse = await table.destroy(doc._id, doc._rev);
      console.log("document deleted");
      return deleteResponse;
    } catch (error) {
      throw new Error(`Error deleting document`);
    }
  }
}
