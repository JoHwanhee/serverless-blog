import {IPostRepository} from "../posts/IPostRepository";
import {Db} from "mongodb";
import {IDbConnection} from "../database/IDbConnection";

export class MongoPostRepository implements IPostRepository {
    constructor(private readonly db: IDbConnection) {}

    async getPosts() {
        return this.db.getDb().collection('posts').find({}).toArray();
    }

    async getPostById(id: any) {
        return this.db.getDb().collection('posts').findOne({ _id: id });
    }

    async getPostByTitle(title: string) {
        return this.db.getDb().collection('posts').findOne({ title });
    }

    async insertPost(document: any) {
        const res = await this.db.getDb().collection('posts').insertOne(document);
        return res;
    }

    async clear() {
        const res = await this.db.getDb().collection('posts').deleteMany({});
        return res;
    }
}
