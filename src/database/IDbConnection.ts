import {Db} from "mongodb";

export interface IDbConnection {
    connect(connectionString?: string, dbName?: string): Promise<IDbConnection>;
    close(): Promise<void>;
    getDb(): any
}
