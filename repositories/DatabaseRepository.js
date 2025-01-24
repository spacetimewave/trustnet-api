const nano = require('nano');

class DatabaseRepository {
    
    constructor(couchDbUrl, dbName) {
        this.couch = nano(couchDbUrl);
        this.db = this.couch.db.use(dbName);
    }

    async createDocument(doc) {
        try {
            const response = await this.db.insert(doc);
            return response;
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }

    async getDocument(docId) {
        try {
            const doc = await this.db.get(docId);
            return doc;
        } catch (error) {
            throw new Error(`Error getting document: ${error.message}`);
        }
    }

    async updateDocument(doc) {
        try {
            const response = await this.db.insert(doc);
            return response;
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        }
    }

    async deleteDocument(docId, rev) {
        try {
            const response = await this.db.destroy(docId, rev);
            return response;
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        }
    }
}

module.exports = DatabaseRepository;