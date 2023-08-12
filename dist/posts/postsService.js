"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
class PostService {
    constructor(database) {
        this.db = database;
    }
    async getAllPosts() {
        return this.db.getPosts();
    }
    async getDetailedPost(title) {
        return this.db.getPostById(title);
    }
}
exports.PostService = PostService;
