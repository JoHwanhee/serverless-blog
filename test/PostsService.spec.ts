import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";
import {IDbConnection} from "../src/database/IDbConnection";
import {Post} from "../src/posts/Post";

describe('PostService', () => {
    let container;
    let repository: IPostRepository;
    let sut: PostService;
    let dbConnection: IDbConnection

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        dbConnection = await new MongoConnection()
        await dbConnection.connect(mongoUri, 'testdb')

        repository = new MongoPostRepository(dbConnection);
        sut = new PostService(repository);
    }, 20000);

    afterAll(async () => {
        await dbConnection.close()
        await container.stop();

    }, 20000);

    beforeEach(async () => {
        await repository.clear()
    })

    it('should fetch all posts', async () => {
        await repository.insertPost({ owner: '123', title: 'Test1' });
        await repository.insertPost({ owner: '123', title: 'Test2' });

        const actual = await sut.getAllPosts('123');

        expect(actual.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const insertedId= await repository.insertPost({ owner: '123', title: 'Test' });

        const actual = await sut.getDetailedPost('123', encodeURIComponent('Test'));

        expect(actual.getId()).toEqual(insertedId);
    });

    it('should create post by content', async () => {
        // @ts-ignore
        await sut.createPost({ owner: '123', title: 'Test', content: "123" } as Post)

        const actual = await sut.getDetailedPost('123', encodeURIComponent('Test'));

        expect(actual.getTitle()).toEqual( 'Test');
        expect(actual.getContent()).toEqual( '123');
    });
});
