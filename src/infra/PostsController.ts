import {PostService} from "../posts/PostsService";
import {Get, Post} from "../decorators/decorators";
import * as posts from "../posts/Post";
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

    // @ts-ignore
    @Get('/write')
    renderWritePage(req: express.Request, res: express.Response): void {
        res.render('write');
    }

    // @ts-ignore
    @Post('/post')
    async createPost(req: express.Request, res: express.Response): Promise<void> {
        const post = posts.Post.Builder
            .withTitle(req.body.title)
            .withThumbnailUrl(req.body.thumbnailUrl)
            .withDescription(req.body.description)
            .withContent(req.body.content)
            .build();

        await this.service.createPost(post);
        res.redirect('/');
    }
}