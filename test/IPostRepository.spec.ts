import {GenericContainer} from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {MongoPostRepository} from "../src/infra/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";
import {IDbConnection} from "../src/database/IDbConnection";


describe('MongoDB class tests with testcontainers', () => {
    let container;
    let repository: IPostRepository;
    let db: IDbConnection;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;

        db = await new MongoConnection()
            .connect(mongoUri, 'testdb')

        repository = new MongoPostRepository(db);
    }, 20000);

    afterAll(async () => {
        await db.close()
        await container.stop();
    }, 20000);

    it('should fetch all posts', async () => {
        await repository.insertPost({ owner: '123',title: 'Test1' });
        await repository.insertPost({ owner: '123',title: 'Test2' });

        const posts = await repository.getPosts('123');

        expect(posts.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const insertedId = await repository.insertPost({ owner: '123',title: 'Test' });

        const post = await repository.getPostByTitle('123', 'Test');

        expect(post.getId()).toEqual(insertedId);
    });
});