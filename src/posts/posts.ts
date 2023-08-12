import {Db, MongoClient} from 'mongodb';

export interface IDatabase {
    connect(connectionString?: string, dbName?: string): Promise<IDatabase>;
    getPosts(): Promise<any[]>;
    getPostById(id: any): Promise<any>;
    getPostByTitle(title: any): Promise<any>;
    insertPost(document: any): Promise<any>;
    clear(): Promise<any>;
    close(): Promise<void>;
}

export class MongoDB implements IDatabase {
    private db: Db;
    private client: MongoClient;

    async connect(connectionString = 'YOUR_MONGODB_URL', dbName = 'YOUR_DB_NAME') {
        //@ts-ignore
        this.client = await MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true });
        this.db = this.client.db(dbName);
        return this;
    }

    async getPosts() {
        return this.db.collection('posts').find({}).toArray();
    }

    async getPostById(id: any) {
        return this.db.collection('posts').findOne({ _id: id });
    }

    async getPostByTitle(title: string) {
        return this.db.collection('posts').findOne({ title });
    }

    async insertPost(document: any) {
        const res = await this.db.collection('posts').insertOne(document);
        return res;
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }

    async clear() {
        const res = await this.db.collection('posts').deleteMany({})
        return res;
    }
}
