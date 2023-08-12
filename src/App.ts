
import express, { Express } from 'express';
import path from 'path';
import {IController} from "./posts/IController";
export class App {
    constructor(
        private readonly app: Express,
        private readonly controllers: IController[]) {
        this.app = app;

        this.setupViewEngine();
        this.setupStaticFiles();
        this.setupRoutesFromControllers(app, controllers);
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

    private setupRoutesFromControllers(app: any, controllers: IController[]) {
        controllers.forEach(controllerInstance => {
            for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))) {
                const routeMetadata = Reflect.getMetadata("route", controllerInstance, key);
                if (routeMetadata) {
                    app[routeMetadata.method](routeMetadata.path, controllerInstance[key].bind(controllerInstance));
                }
            }
        });
    }

    public express(): Express {
        return this.app;
    }
}