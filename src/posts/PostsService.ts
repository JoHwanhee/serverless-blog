import {IDatabase} from "./posts";

export class PostService {
    private db: IDatabase;

    constructor(database: IDatabase) {
        this.db = database;
    }

    async getAllPosts() {
        return this.db.getPosts();
    }

    async getDetailedPost(title: string) {
        return this.db.getPostByTitle(title);
    }
}
