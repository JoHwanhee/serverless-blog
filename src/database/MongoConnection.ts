import {IDbConnection} from "./IDbConnection";
import {Db, MongoClient} from "mongodb";


export class MongoConnection implements IDbConnection {
    private client: MongoClient;
    private db: Db
    // @ts-ignore
    async connect(connectionString = 'YOUR_MONGODB_URL', dbName = 'YOUR_DB_NAME'): Promise<IDbConnection> {
        //@ts-ignore
        this.client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = this.client.db(dbName);

        // @ts-ignore
        return this;
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
    getDb(): any {
        return this.db;
    }
}