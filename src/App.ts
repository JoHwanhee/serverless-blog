import express, { Express } from 'express';
import path from 'path';
import {IController} from "./infra/IController";

export class App {
    constructor(
        private readonly app: Express,
        private readonly controllers: IController[]) {
        this.app = app;

        this.setupBodyParser(app);
        this.setupViewEngine(app);
        this.setupStaticFiles(app);
        this.setupRoutesFromControllers(app, controllers);
    }

    private setupBodyParser(app: Express) {
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
    }

    private setupViewEngine(app: Express): void {
        const currentDir = path.resolve();
        app.set('view engine', 'ejs');
        app.set('views', path.join(currentDir, 'src/views'));
    }

    private setupStaticFiles(app: Express): void {
        const currentDir = path.resolve();
        app.use(express.static(path.join(currentDir, 'src/public')));
    }

    private setupRoutesFromControllers(app: Express, controllers: IController[]) {
        controllers.forEach(controllerInstance => {
            for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))) {
                const routeMetadata = Reflect.getMetadata("route", controllerInstance, key);
                if (routeMetadata) {
                    app[routeMetadata.method](routeMetadata.path, controllerInstance[key].bind(controllerInstance));
                }
            }
        });
    }

    public dispose() {

    }

    public express(): Express {
        return this.app;
    }
}