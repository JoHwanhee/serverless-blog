import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {PostsController} from "../src/infra/PostsController";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";
import {Db} from "mongodb";

describe('Controller functions', () => {
    let container;
    let db: Db;
    let repository: IPostRepository;
    let service: PostService;
    let controller: PostsController;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;

        db = await new MongoConnection()
            .connect(mongoUri, 'testdb')

        repository = new MongoPostRepository(db);
        service = new PostService(repository);
        controller = new PostsController(service);
    }, 10000);

    afterAll(async () => {
        if (container) await container.stop();
    }, 10000);


    it('should render the homepage with all posts', async () => {
        const mockPosts = [{ title: 'Test1' }, { title: 'Test2' }];
        jest.spyOn(service, 'getAllPosts').mockResolvedValue(mockPosts);

        const req = {}; // 필요에 따라 더 상세한 요청 객체를 모조할 수 있습니다.
        const res = {
            render: jest.fn()
        };

        await controller.renderHomepage(req as any, res as any);

        expect(res.render).toHaveBeenCalledWith('index', { posts: mockPosts });
    });

    it('should render a detailed post by id', async () => {
        const mockPost = { title: 'Test1', _id: 'some_id' };
        jest.spyOn(service, 'getDetailedPost').mockResolvedValue(mockPost);

        const req = {
            params: {
                id: 'some_id'
            }
        };
        const res = {
            render: jest.fn()
        };

        await controller.renderPost(req as any, res as any);

        expect(res.render).toHaveBeenCalledWith('post', { post: mockPost });
    });
});
