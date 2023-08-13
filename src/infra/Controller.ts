import {PostService} from "../posts/PostsService";
import {Get, Post} from "../decorators/decorators";
import * as posts from "../posts/Post";
import express from "express";
import {IController} from "./IController";
import { OAuth2Client } from 'google-auth-library';
import {Blog} from "../blog/Blog";



export class Controller implements IController {

    constructor(
        private readonly service: PostService,
    ) {
    }

    // @ts-ignore
    @Get('/')
    async renderHomepage(req: express.Request, res: express.Response): Promise<void> {
        res.render('index');
    }

    // @ts-ignore
    @Get('/:owner')
    async renderBlog(req: express.Request, res: express.Response): Promise<void> {
        const owner = req.params.owner

        const blog = Blog.Builder
            .withTitle(`${owner}'s today log`)
            .withDescription('나의 일상에 관한 이야기')
            .build(owner)

        const posts = await this.service.getAllPosts(owner);

        res.render('blog', { blog, posts });
    }

    // @ts-ignore
    @Get('/:owner/post/:title')
    async renderPost(req: express.Request, res: express.Response): Promise<void> {
        const owner = req.params.owner
        const title = req.params.title

        const post = await this.service.getDetailedPost(owner, title);

        res.render('post', { post });
    }

    // @ts-ignore
    @Get('/:owner/write')
    renderWritePage(req: express.Request, res: express.Response): void {
        const owner = req.params.owner

        const blog = Blog.Builder
            .withTitle(`${owner}'s today log`)
            .withDescription('나의 일상에 관한 이야기')
            .build(owner)

        res.render('write', {
            blog
        });
    }

    // @ts-ignore
    @Post('/:owner/post')
    async createPost(req: express.Request, res: express.Response): Promise<void> {
        const owner = req.params.owner;
        const post = posts.Post.Builder
            .withTitle(req.body.title)
            .withThumbnailUrl(req.body.thumbnailUrl)
            .withDescription(req.body.description)
            .withContent(req.body.content)
            .build(req.params.owner);

        await this.service.createPost(post);
        res.redirect(`/${owner}`);
    }
}