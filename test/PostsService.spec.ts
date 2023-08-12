import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";

describe('PostService', () => {
    let container;
    let repository: IPostRepository;
    let sut: PostService;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        const db = await new MongoConnection()
            .connect(mongoUri, 'testdb')

        repository = new MongoPostRepository(db);
        sut = new PostService(repository);
    }, 10000);

    afterAll(async () => {
        if (container) await container.stop();
    }, 10000);

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
