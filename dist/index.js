"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_http_1 = __importDefault(require("serverless-http"));
const PostsService_1 = require("./posts/PostsService");
const controller_1 = require("./posts/controller");
const app_1 = require("./app");
const posts_1 = require("./posts/posts");
const express_1 = __importDefault(require("express"));
async function initializeApp() {
    const mongoUri = 'mongodb+srv://admin:admin1234@cluster0.xsrp3cx.mongodb.net/?retryWrites=true&w=majority';
    const database = new posts_1.MongoDB();
    await database.connect(mongoUri, 'testdb');
    const postService = new PostsService_1.PostService(database);
    const postController = new controller_1.PostsController(postService);
    const appInstance = new app_1.App((0, express_1.default)(), postController);
    return appInstance.getApp();
}
const handler = async (event, context) => {
    return (0, serverless_http_1.default)(await initializeApp())(event, context);
};
exports.handler = handler;
