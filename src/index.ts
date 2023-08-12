import 'reflect-metadata';
import serverless from 'serverless-http'
import {PostService} from "./posts/PostsService";
import {PostsController} from "./infra/PostsController";
import {App} from "./App";
import express from "express";
import {MongoPostRepository} from "./infra/MongoPostRepository";
import {MongoConnection} from "./database/MongoConnection";

async function initializeApp() {
    const mongoUri = process.env.MONGO_URI;

    const db = await new MongoConnection()
        .connect(mongoUri, 'testdb')
    const database = new MongoPostRepository(db);

    const postService = new PostService(database);
    const postController = new PostsController(postService);

    const appInstance = new App(express(), [postController]);
    return appInstance.express();
}


export const handler = async (event, context) => {
    return serverless(await initializeApp())(event, context);
};
