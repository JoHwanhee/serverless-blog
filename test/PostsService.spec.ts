import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";
import {IDbConnection} from "../src/database/IDbConnection";

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
        await repository.insertPost({ title: 'Test1' });
        await repository.insertPost({ title: 'Test2' });

        const actual = await sut.getAllPosts();

        expect(actual.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const { insertedId } = await repository.insertPost({ title: 'Test' });

        const actual = await sut.getDetailedPost(encodeURIComponent('Test'));

        expect(actual).toEqual({ _id: insertedId, title: 'Test' });
    });

    it('should create post by content', async () => {
        await sut.createPost({ title: 'Test', content: "123" })

        const actual = await sut.getDetailedPost(encodeURIComponent('Test'));

        expect(actual.title).toEqual( 'Test');
        expect(actual.content).toEqual( '123');
    });
});
