import 'reflect-metadata';
import serverless from 'serverless-http'
import {PostService} from "./posts/PostsService";
import {PostsController} from "./controllers/controller";
import {App} from "./app";
import {MongoDB} from "./posts/posts";
import express from "express";

async function initializeApp() {
    const mongoUri = process.env.MONGO_URI;
    const database = new MongoDB();
    await database.connect(mongoUri, 'testdb');

    const postService = new PostService(database);
    const postController = new PostsController(postService);

    const appInstance = new App(express(), [postController]);
    return appInstance.express();
}


export const handler = async (event, context) => {
    return serverless(await initializeApp())(event, context);
};
