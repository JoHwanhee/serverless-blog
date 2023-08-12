"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
class App {
    constructor(app, postsController) {
        this.app = app;
        this.postsController = postsController;
        this.setupViewEngine();
        this.setupStaticFiles();
        this.setupRoutes();
    }
    setupViewEngine() {
        const currentDir = path_1.default.resolve();
        this.app.set('view engine', 'ejs');
        this.app.set('views', path_1.default.join(currentDir, 'src/views'));
    }
    setupStaticFiles() {
        const currentDir = path_1.default.resolve();
        this.app.use(express_1.default.static(path_1.default.join(currentDir, 'src/public')));
    }
    setupRoutes() {
        this.app.get(['/', '/index.html'], (req, res) => this.postsController.renderHomepage(req, res));
        this.app.get('/post/:title', (req, res) => this.postsController.renderPost(req, res));
    }
    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
    getApp() {
        return this.app;
    }
}
exports.App = App;
