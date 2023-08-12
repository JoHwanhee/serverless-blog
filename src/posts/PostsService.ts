import {IPostRepository} from "./IPostRepository";

export class PostService {
    private db: IPostRepository;

    constructor(database: IPostRepository) {
        this.db = database;
    }

    async getAllPosts() {
        return this.db.getPosts();
    }

    async getDetailedPost(title: string) {
        return this.db.getPostByTitle(title);
    }

    async createPost(post: {title: any; content: any}) {
        return this.db.insertPost(post);
    }
}
