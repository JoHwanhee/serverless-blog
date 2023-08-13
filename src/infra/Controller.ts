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
    @Get('/auth/callback')
    async authCallback(req: express.Request, res: express.Response): Promise<void> {
        try {
            const CLIENT_ID = '125703249510-5ska8h67gdtojna23e4enr5iqvrl9alc.apps.googleusercontent.com'
            const client = new OAuth2Client(CLIENT_ID);

            const token = req.query.code; // Google에서 제공하는 인증 코드

            console.log(token)
            if (!token) {
                res.status(400).send('No code provided');
                return;
            }


            const ticket = await client.verifyIdToken({
                // @ts-ignore
                idToken: token ?? "",
                audience: CLIENT_ID,
            });

            // @ts-ignore
            const payload = ticket.getPayload();

            if (!payload) {
                res.status(400).send('Invalid token');
                return;
            }

            const userId = payload.sub; // Google 사용자 ID
            const email = payload.email; // Google 사용자의 이메일

            console.log(userId)
            // TODO: 위에서 가져온 정보를 사용해 추가적인 인증 처리나 사용자 생성, 세션 관리 등의 작업을 수행합니다.

            res.send('Successfully authenticated!');
        } catch (err) {
            res.status(500).send('Authentication failed');
        }
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