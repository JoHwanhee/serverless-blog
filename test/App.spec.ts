// @ts-ignore
import request from 'supertest';

import * as cheerio from 'cheerio';


import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {App} from "../src/App";
import {PostsController} from "../src/infra/PostsController";
// @ts-ignore
import express from "express";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";

describe('App routes', () => {
    let sut
    let container;
    let appInstance;
    let mongoUri;
    let repository: IPostRepository;

    let postService;
    let postController;
    let app;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        const db = await new MongoConnection()
            .connect(mongoUri, 'testdb')
        repository = new MongoPostRepository(db);

        postService = new PostService(repository);
        postController = new PostsController(postService);

        app = express();
        appInstance = new App(app, [postController]);

    }, 10000);

    afterAll(async () => {
        if (container) await container.stop();
    });

    describe('GET /', () => {
        beforeEach(async () => {
            await repository.clear()
            await repository.insertPost({ title: '제목1', content: '내용1' });
            await repository.insertPost({ title: '제목2', content: '내용2' });
            sut = await request(appInstance.express()).get('/');
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
            await repository.clear()
            const title = '제목1'
            const post = await repository.insertPost({ title, content: '내용1' });

            sut = await request(appInstance.express()).get(`/post/${encodeURIComponent(title)}`);
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

    describe('새 글 쓰기 페이지 UI 테스트', () => {
        let sut;

        beforeAll(async () => {
            sut = await request(appInstance.express()).get(`/write`);
        });

        it('"/write" 경로에 대한 GET 요청시 200 OK 응답을 반환해야 한다.', () => {
            expect(sut.status).toBe(200);
        });

        it('제목 입력 필드가 있어야 한다.', () => {
            const $ = cheerio.load(sut.text);
            const titleInput = $('input[name="title"]');
            expect(titleInput.length).toBe(1);
        });

        it('내용 입력 필드가 있어야 한다.', () => {
            const $ = cheerio.load(sut.text);
            const contentTextarea = $('textarea[name="content"]');
            expect(contentTextarea.length).toBe(1);
        });

        it('저장 버튼이 있어야 한다.', () => {
            const $ = cheerio.load(sut.text);
            const submitButton = $('button[type="submit"]');
            expect(submitButton.length).toBe(1);
            expect(submitButton.text()).toBe('저장');
        });
    });

    describe('POST /post', () => {
        let sut;

        beforeEach(async () => {
            const newPostData = { title: 'Test Title', content: 'Test Content' };
            sut = await request(appInstance.express())
                .post('/post')
                .send(newPostData)
        });


        it('should successfully create a post and redirect to root', async () => {
            expect(sut.status).toBe(302); // 302 is for redirection
            expect(sut.header.location).toBe('/'); // should redirect to root
        });
    });


    describe('GET /test.txt', () => {
        let sut;

        beforeEach(async () => {
            sut = await request(appInstance.express()).get('/test.txt');
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

