import {PostService} from "../posts/PostsService";
import {Get} from "../decorators/Controller";
import express from "express";

export interface IController { }

export class PostsController implements IController {

    constructor(private readonly service: PostService) {
    }

    // @ts-ignore
    @Get('/')
    async renderHomepage(req: express.Request, res: express.Response): Promise<void> {
        const posts = await this.service.getAllPosts();
        res.render('index', { posts });
    }

    // @ts-ignore
    @Get('/post/:title')
    async renderPost(req: any, res: any): Promise<void> {
        const post = await this.service.getDetailedPost(req.params.title);
        res.render('post', { post });
    }
}