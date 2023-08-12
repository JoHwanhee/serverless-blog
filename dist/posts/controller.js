"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
class PostsController {
    constructor(service) {
        this.service = service;
    }
    async renderHomepage(req, res) {
        const posts = await this.service.getAllPosts();
        res.render('index', { posts });
    }
    async renderPost(req, res) {
        const post = await this.service.getDetailedPost(req.params.title);
        res.render('post', { post });
    }
}
exports.PostsController = PostsController;
