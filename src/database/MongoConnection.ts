import {IDbConnection} from "./IDbConnection";
import {Db, MongoClient} from "mongodb";


export class MongoConnection implements IDbConnection {
    private client: MongoClient;

    // @ts-ignore
    async connect(connectionString = 'YOUR_MONGODB_URL', dbName = 'YOUR_DB_NAME'): Promise<Db> {
        //@ts-ignore
        this.client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        return this.client.db(dbName);
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
}