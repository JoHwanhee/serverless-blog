"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = void 0;
const mongodb_1 = require("mongodb");
class MongoDB {
    async connect(connectionString = 'YOUR_MONGODB_URL', dbName = 'YOUR_DB_NAME') {
        //@ts-ignore
        this.client = await mongodb_1.MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = this.client.db(dbName);
        return this;
    }
    async getPosts() {
        return this.db.collection('posts').find({}).toArray();
    }
    async getPostById(id) {
        return this.db.collection('posts').findOne({ _id: id });
    }
    async insertPost(document) {
        const res = await this.db.collection('posts').insertOne(document);
        return res;
    }
    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
}
exports.MongoDB = MongoDB;
