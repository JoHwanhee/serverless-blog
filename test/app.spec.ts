// @ts-ignore
import request from 'supertest';

import * as cheerio from 'cheerio';


import { GenericContainer } from 'testcontainers';
import {IDatabase, MongoDB} from "../src/posts/posts";
import {PostService} from "../src/posts/PostsService";
import {App} from "../src/app";
import {PostsController} from "../src/posts/controller";
// @ts-ignore
import express from "express";

describe('App routes', () => {
    let sut
    let container;
    let appInstance;
    let mongoUri;
    let database: IDatabase;

    let postService;
    let postController;
    let app;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;

        database = new MongoDB();
        await database.connect(mongoUri, 'testdb');
        postService = new PostService(database);
        postController = new PostsController(postService);

        app = express();
        appInstance = new App(app, postController);

    }, 30000);

    afterAll(async () => {
        if (container) await container.stop();
        if (database) await database.close()
    });

    describe('GET /', () => {
        beforeEach(async () => {
            await database.clear()
            await database.insertPost({ title: '제목1', content: '내용1' });
            await database.insertPost({ title: '제목2', content: '내용2' });
            sut = await request(appInstance.getApp()).get('/');
        });

        it('200 응답 되어야한다.', async () => {
            const actual = sut.statusCode

            expect(actual).toBe(200);
        });

        it('post 데이터가 h2 태그로 응답이 있어야한다.', async () => {
            const actual = parseHtmlToPosts(cheerio.load(sut.text));

            expect(actual).toEqual([
                { title: '제목1', content: '내용1' },
                { title: '제목2', content: '내용2' },
            ]);
        });

        function parseHtmlToPosts($) {
            const posts = [];

            $('h2').each((i, el) => {
                posts.push({
                    title: $(el).text(),
                    content: $(el).next().text()
                });
            });

            return posts
        }
    });

    describe('GET /post/:title', () => {
        let sut;

        beforeEach(async () => {
            await database.clear()
            const title = '제목1'
            const post = await database.insertPost({ title, content: '내용1' });

            sut = await request(appInstance.getApp()).get(`/post/${encodeURIComponent(title)}`);
        });

        it('200 응답 되어야한다.', async () => {
            const actual = sut.statusCode;

            expect(actual).toBe(200);
        });

        it('특정 post 데이터가 h2 태그로 응답이 있어야한다.', async () => {
            const actual = parseHtmlToPost(cheerio.load(sut.text));

            expect(actual).toEqual({ title: '제목1', content: '내용1' });
        });

        function parseHtmlToPost($) {
            const title = $('h2').text();
            const content = $('p').first().text();

            return { title, content };
        }
    });

    describe('GET /test.txt', () => {
        let sut;

        beforeEach(async () => {
            sut = await request(appInstance.getApp()).get('/test.txt');
        });

        it('200 응답 되어야한다.', async () => {
            const actual = sut.statusCode;

            expect(actual).toBe(200);
        });

        it('test.txt 파일의 내용이 "test" 인지 확인', async () => {
            const actual = sut.text;

            expect(actual).toBe('test');
        });
    });
});

