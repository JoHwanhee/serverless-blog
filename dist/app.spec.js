"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("./app"));
const cheerio = __importStar(require("cheerio"));
describe('GET /', () => {
    let sut;
    beforeEach(async () => {
        sut = await (0, supertest_1.default)(app_1.default).get('/');
    });
    it('200 응답 되어야한다.', async () => {
        const actual = sut.statusCode;
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
        return posts;
    }
});
describe('GET /post/:id', () => {
    let sut;
    beforeEach(async () => {
        const id = 1;
        sut = await (0, supertest_1.default)(app_1.default).get(`/post/${id}`);
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
        sut = await (0, supertest_1.default)(app_1.default).get('/test.txt');
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
