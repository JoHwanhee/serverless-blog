import {Db} from "mongodb";

export interface IDbConnection {
    connect(connectionString?: string, dbName?: string): Promise<Db>;
    close(): Promise<void>;
}
