import {GenericContainer} from 'testcontainers';
import {IDatabase, MongoDB} from "../src/posts/posts";


describe('MongoDB class tests with testcontainers', () => {
    let container;
    let database: IDatabase;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        database = new MongoDB();
        await database.connect(mongoUri, 'testdb');
    }, 30000);

    afterAll(async () => {
        if (database) await database.close();  // 'close' 함수가 MongoDB 클래스에 정의되어 있지 않아서 이 부분은 에러가 발생할 수 있습니다.
        if (container) await container.stop();
    }, 30000);

    it('should fetch all posts', async () => {
        await database.insertPost({ title: 'Test1' });
        await database.insertPost({ title: 'Test2' });

        const posts = await database.getPosts();

        expect(posts.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const { insertedId } = await database.insertPost({ title: 'Test' });

        const post = await database.getPostById(insertedId);

        expect(post).toEqual({ _id: insertedId, title: 'Test' });
    });
});