import Nano, { MangoResponse } from "nano";
import DnsEntry from "../models/DnsEntry";

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

  async createDnsName(doc: DnsEntry) {
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
      const response = await table.insert({ ...doc, _id: undefined }); // null id (assigned by CouchDB)
      console.log("document inserted");
      return response;
    } catch (error) {
      //   throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async getDnsEntryByName(name: string): Promise<DnsEntry | undefined> {
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
        selector: { name: name },
      })) as MangoResponse<DnsEntry | undefined>;
      if (response.docs.length === 0) {
        return undefined;
      }

      const doc = response.docs[0];
      const dnsEntry: DnsEntry = {
        name: doc.name,
        urls: doc.urls,
        ips: doc.ips,
      };

      return dnsEntry;
    } catch (error: unknown) {
      throw new Error();
    }
  }

  async checkDnsNameAvailability(name: string): Promise<boolean> {
    const user = this.getDnsEntryByName(name);
    return user === undefined;
  }
}
