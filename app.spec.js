import request from 'supertest';
import app from './app';
import * as cheerio from 'cheerio';

describe('GET /', () => {
    let sut

    beforeEach(async () => {
        sut = await request(app).get('/');
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

describe('GET /post/:id', () => {
    let sut;

    beforeEach(async () => {
        const id = 1;
        sut = await request(app).get(`/post/${id}`);
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
