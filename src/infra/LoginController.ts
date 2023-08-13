import {PostService} from "../posts/PostsService";
import {Get, Post} from "../decorators/decorators";
import * as posts from "../posts/Post";
import express from "express";
import {IController} from "./IController";
import { OAuth2Client } from 'google-auth-library';
import {Blog} from "../blog/Blog";



export class LoginController implements IController {

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
            console.log(email)
            console.log(payload)

            res.send('Successfully authenticated!');
        } catch (err) {
            res.status(500).send('Authentication failed');
        }
    }
}