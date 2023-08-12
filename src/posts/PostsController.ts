import {PostService} from "./PostsService";
import {Get} from "../decorators/decorators";
import express from "express";
import {IController} from "./IController";


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
    async renderPost(req: express.Request, res: express.Response): Promise<void> {
        const post = await this.service.getDetailedPost(req.params.title);
        res.render('post', { post });
    }
}