import {PostService} from "./PostsService";

export interface IController {
    renderHomepage(req, res): Promise<void>;
    renderPost(req, res): Promise<void>;
}


export class PostsController implements IController {

    constructor(private readonly service: PostService) {
    }

    async renderHomepage(req, res): Promise<void> {
        const posts = await this.service.getAllPosts();
        res.render('index', { posts });
    }

    async renderPost(req, res): Promise<void> {
        const post = await this.service.getDetailedPost(req.params.title);
        res.render('post', { post });
    }
}