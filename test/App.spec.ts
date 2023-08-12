// @ts-ignore
import request from 'supertest';

import * as cheerio from 'cheerio';
import { GenericContainer } from 'testcontainers';
import {createDatabaseConnection, initializeApp} from "../src";

describe('App routes', () => {
    let sut
    let container;
    let mongoUri;

    let dbConnection;
    let app;
    let server;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        dbConnection = await createDatabaseConnection(mongoUri, "testDb");

        app = await initializeApp(dbConnection)
        server = app.listen(3000);

        const newPostData = ( { owner: 'chohh', title: '제목1', description: '소제목1', content: '내용1' });
        await request(app)
            .post('/chohh/post')
            .send(newPostData)

        const newPostData2 = ( { owner: 'chohh', title: '제목2', description: '소제목1', content: '내용2' });
        await request(app)
            .post('/chohh/post')
            .send(newPostData2)
    }, 20000);

    afterAll(async () => {
        await dbConnection.close()
        await container.stop();
        await server.close();
    });

    describe('GET /', () => {
        beforeEach(async () => {
            sut = await request(app).get('/');
        });

        it('200 응답 되어야한다.', async () => {
            const actual = sut.statusCode

            expect(actual).toBe(200);
        });
    });

    describe('GET /:owner', () => {
        let response;

        beforeEach(async () => {
            const title = '제목1';
            response = await request(app).get(`/chohh`);
        });

        it('should respond with status 200', async () => {
            expect(response.statusCode).toBe(200);
        });


        it('post 데이터가 h2 태그로 응답이 있어야한다.', async () => {
            const actuals = parseHtmlToPosts(cheerio.load(sut.text));

            actuals.forEach((actual) => {
                expect(actual.title).toContain('제목');
                expect(actual.title).toContain('시간');
                expect(actual.description).toContain('소제목');
            })
        });

        function parseHtmlToPosts($) {
            const posts = [];

            $('h2').each((i, el) => {
                posts.push({
                    title: $(el).text(),
                    description: $(el).next().text()
                });
            });

            return posts
        }
    });

    describe('GET /:owner/post/:title', () => {
        let response;

        beforeEach(async () => {
            const title = '제목1';
            response = await request(app).get(`/chohh/post/${encodeURIComponent(title)}`);
        });

        it('should respond with status 200', async () => {
            expect(response.statusCode).toBe(200);
        });

        it('should display the correct post data in h2 tag', async () => {
            const post = parseHtmlToPost(cheerio.load(response.text));

            expect(post.title).toEqual('제목1');
            expect(post.content).toEqual('내용1');
        });

        it('should display the post date in the correct format', async () => {
            const $ = cheerio.load(response.text);
            const dateText = $('.post-date').text();

            // This regex checks for the yyyy/mm/dd format
            expect(dateText).toContain('작성일');
        });

        function parseHtmlToPost($) {
            const title = $('h2').text();
            const content = $('.post-content').first().text();

            return { title, content };
        }
    });

    describe('GET /:owner/write', () => {
        let sut;

        beforeAll(async () => {
            sut = await request(app).get(`/chohh/write`);
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

    describe('POST /:owner/post', () => {
        let sut;

        beforeEach(async () => {
            const newPostData = { owner: 'chohh',title: 'Test Title', content: 'Test Content' };
            sut = await request(app)
                .post('/chohh/post')
                .send(newPostData)
        });


        it('should successfully create a post and redirect to root', async () => {
            expect(sut.status).toBe(302); // 302 is for redirection
            expect(sut.header.location).toBe('/chohh'); // should redirect to root
        });
    });


    describe('GET /test.txt', () => {
        let sut;

        beforeEach(async () => {
            sut = await request(app).get('/test.txt');
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

