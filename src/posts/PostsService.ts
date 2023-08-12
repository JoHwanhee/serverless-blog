import {IPostRepository} from "./IPostRepository";
import {Post} from "./Post";

export class PostService {
    private db: IPostRepository;

    constructor(database: IPostRepository) {
        this.db = database;
    }

    async getAllPosts() {
        return await this.db.getPosts();
    }

    async getDetailedPost(title: string) {
        return await this.db.getPostByTitle(title);
    }

    async createPost(post: Post) {
        return await this.db.insertPost(post);
    }
}
