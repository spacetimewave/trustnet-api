const nano = require('nano');

class DatabaseRepository {

    constructor(dbEndpoint, dbName, dbUser, dbPassword) {
        this.dbEndpoint = dbEndpoint;
        this.dbName = dbName;
        this.dbUser = dbUser;
        this.dbPassword = dbPassword;
    }
    
    async createDnsName(doc) {
        try {
            
            const database = nano(this.dbEndpoint);
            await database.auth(this.dbUser, this.dbPassword)
            // database.db.create(this.dbName);
            const table = database.db.use(this.dbName);
            const response = await table.insert({ name: "test.stw", urls:["spacetimewave.com/trustnet"], ips:[] }, null); // null id (assigned by CouchDB)
            return response;
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }
}

module.exports = DatabaseRepository;