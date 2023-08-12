import {IPostRepository} from "../posts/IPostRepository";
import {Db} from "mongodb";
import {IDbConnection} from "../database/IDbConnection";
import {Post} from "../posts/Post";
import {IBlogRepository} from "../blog/IBlogRepository";
import {Blog} from "../blog/Blog";


export class MongoBlogRepository implements IBlogRepository {
    constructor(private readonly db: IDbConnection) {}

    async getBlog(owner: string): Promise<Blog> {
        const doc = await this.db.getDb().collection('blogs').findOne({ owner });
        return this.docToPost(doc, owner)
    }

    private docToPost(doc: any, owner: string): Blog {
        return Blog.Builder
            .withId(doc._id.toString())
            .withTitle(doc.title)
            .withThumbnailUrl(doc.thumbnailUrl)
            .withDescription(doc.description)
            .build(owner);
    }
}