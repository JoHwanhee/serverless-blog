import {IPostRepository} from "../posts/IPostRepository";
import {Db} from "mongodb";

export class MongoPostRepository implements IPostRepository {
    constructor(private readonly db: Db) {}

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

    async clear() {
        const res = await this.db.collection('posts').deleteMany({});
        return res;
    }
}
