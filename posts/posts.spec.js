// dataLayer.test.mjs
import { GenericContainer } from 'testcontainers';
import * as sut from "./posts.mjs";

describe('posts', () => {
    let container;
    let db;

    beforeAll(async () => {
        // MongoDB 컨테이너 시작
        container = await new GenericContainer('mongo', 'latest')
            .withExposedPorts(27017)
            .start();

        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        db = await sut.connect(mongoUri, 'testdb');
    }, 30000);

    afterAll(async () => {
        await db.close();
        await container.stop();
    }, 30000);

    it('should fetch all posts', async () => {
        await sut.insertPost(db, { title: 'Test1' });
        await sut.insertPost(db, { title: 'Test2' });

        const posts = await sut.getPosts(db);

        expect(posts.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const { insertedId } = await sut.insertPost(db, { title: 'Test' });

        const post = await sut.getPostById(db, insertedId);

        expect(post).toEqual({ _id: insertedId, title: 'Test' });
    });
});
