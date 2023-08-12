import express, { Express } from 'express';
import path from 'path';
import {IController} from "./posts/controller";
export class App {
    private app: Express;
    private postsController: IController;

    constructor(app: Express, postsController: IController) {
        this.app = app;
        this.postsController = postsController;

        this.setupViewEngine();
        this.setupStaticFiles();
        this.setupRoutes();
    }

    private setupViewEngine(): void {
        const currentDir = path.resolve();
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(currentDir, 'src/views'));
    }

    private setupStaticFiles(): void {
        const currentDir = path.resolve();
        this.app.use(express.static(path.join(currentDir, 'src/public')));
    }

    private setupRoutes(): void {
        this.app.get(['/','/index.html'], (req, res) => this.postsController.renderHomepage(req, res));
        this.app.get('/post/:title', (req, res) => this.postsController.renderPost(req, res));
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }

    public getApp(): Express {
        return this.app;
    }
}