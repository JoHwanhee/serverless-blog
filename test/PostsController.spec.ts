import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {Controller} from "../src/infra/Controller";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";
import {IDbConnection} from "../src/database/IDbConnection";

describe('Controller functions', () => {
    let container;
    let dbConnection: IDbConnection;
    let repository: IPostRepository;
    let service: PostService;
    let controller: Controller;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;

        dbConnection = new MongoConnection()
        await dbConnection.connect(mongoUri, 'testdb')

        repository = new MongoPostRepository(dbConnection);
        service = new PostService(repository);
        controller = new Controller(service);
    }, 20000);

    afterAll(async () => {
        await dbConnection.close()
        await container.stop();
    }, 20000);


    it('should render the homepage with all posts', async () => {
        const req = {}; // 필요에 따라 더 상세한 요청 객체를 모조할 수 있습니다.
        const res = {
            render: jest.fn()
        };

        await controller.renderHomepage(req as any, res as any);

        expect(res.render).toHaveBeenCalledWith('index');
    });

    it('should render a detailed post by id', async () => {
        const mockPost = { title: 'Test1', _id: 'some_id' };
        // @ts-ignore
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
