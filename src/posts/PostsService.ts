import {IPostRepository} from "./IPostRepository";
import {Post} from "./Post";

export class PostService {
    private db: IPostRepository;

    constructor(database: IPostRepository) {
        this.db = database;
    }

    async getAllPosts(owner: string) {
        return await this.db.getPosts(owner);
    }

    async getDetailedPost(owner: string, title: string) {
        return await this.db.getPostByTitle(owner, title);
    }

    async createPost(post: Post) {
        return await this.db.insertPost(post);
    }
}
