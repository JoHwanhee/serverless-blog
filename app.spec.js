import request from 'supertest';
import app from './app';
import * as cheerio from 'cheerio';

describe('GET /', () => {
    it('post 데이터가 h2 태그로 응답이 있어야한다.', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);

        const $ = cheerio.load(response.text);
        const posts = [];

        $('h2').each((i, el) => {
            posts.push({
                title: $(el).text(),
                content: $(el).next().text()
            });
        });

        expect(posts).toEqual([
            { title: '제목1', content: '내용1' },
            { title: '제목2', content: '내용2' },
        ]);
    });
});


describe('GET /post/:id', () => {
    it('title: h2, content: p 로 들어가야함', async () => {
        const id = 1;
        const response = await request(app).get(`/post/${id}`);
        expect(response.statusCode).toBe(200);

        const $ = cheerio.load(response.text);
        const post = {
            title: $('h2').text(),
            content: $('p').text()
        };

        expect(post).toEqual({ title: '제목' + id, content: '내용' + id });
    });
});
