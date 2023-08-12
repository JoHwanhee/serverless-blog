import 'reflect-metadata';
import serverless from 'serverless-http';
import { PostService } from "./posts/PostsService";
import { PostsController } from "./infra/PostsController";
import { App } from "./App";
import express from "express";
import { MongoPostRepository } from "./infra/MongoPostRepository";
import { MongoConnection } from "./database/MongoConnection";
import {Db} from "mongodb";
import {IDbConnection} from "./database/IDbConnection";

export async function createDatabaseConnection(mongoUri: string, dbName: string) {
    const connection = new MongoConnection()
    await connection.connect(mongoUri, dbName);

    return connection
}

function createPostRepository(db) {
    return new MongoPostRepository(db);
}

function createPostService(repository) {
    return new PostService(repository);
}

function createPostController(service) {
    return new PostsController(service);
}

export async function initializeApp(db: IDbConnection) {
    const postRepository = createPostRepository(db);
    const postService = createPostService(postRepository);
    const postController = createPostController(postService);
    return new App(express(), [postController]).express();
}

// Create an application instance outside the handler to reuse it across warm Lambda invocations.
let cachedApp;
export const handler = async (event, context) => {
    if (!cachedApp) {
        const mongouri = process.env.MONGO_URI;
        const testdb = 'testdb';
        const db = await createDatabaseConnection(mongouri, testdb);
        cachedApp = await initializeApp(db);
    }
    return serverless(cachedApp)(event, context);
};
