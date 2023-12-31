import {IPostRepository} from "../posts/IPostRepository";
import {Db} from "mongodb";
import {IDbConnection} from "../database/IDbConnection";
import {Post} from "../posts/Post";


export class MongoPostRepository implements IPostRepository {
    constructor(private readonly db: IDbConnection) {}

    async getPosts(owner: string): Promise<Post[]> {
        const docs = await this.db.getDb().collection('posts').find({ owner }).sort({ createdAt: -1 }).toArray();
        return docs.map(doc => this.docToPost(doc));
    }

    async getPostById(id: any): Promise<Post | null> {
        const doc = await this.db.getDb().collection('posts').findOne({ _id: id });
        return doc ? this.docToPost(doc) : null;
    }

    async getPostByTitle(owner: string, title: string): Promise<Post | null> {
        const doc = await this.db.getDb().collection('posts').findOne({ owner, title });
        return doc ? this.docToPost(doc) : null;
    }

    async insertPost(document: any): Promise<string> {
        const res = await this.db.getDb().collection('posts').insertOne(document);
        console.log(res)
        return res.insertedId.toString()
    }

    async clear(): Promise<any> {
        const res = await this.db.getDb().collection('posts').deleteMany({});
        return res;
    }

    private docToPost(doc: any): Post {
        return Post.Builder
            .withId(doc._id.toString())
            .withTitle(doc.title)
            .withThumbnailUrl(doc.thumbnailUrl)
            .withDescription(doc.description)
            .withContent(doc.content)
            .build(doc.owner);
    }
}