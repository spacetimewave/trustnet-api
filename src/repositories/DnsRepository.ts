import Nano from "nano";

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

  async createDnsName(doc: {
    id: number;
    name: string;
    urls: string[];
    ips: string[];
  }) {
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
}
