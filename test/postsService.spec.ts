import { GenericContainer } from 'testcontainers';
import {IDatabase, MongoDB} from "../src/posts/posts";
import {PostService} from "../src/posts/PostsService";

describe('PostService', () => {
    let container;
    let db: IDatabase;
    let postService: PostService;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;

        db = new MongoDB();
        await db.connect(mongoUri, 'testdb');
        postService = new PostService(db);
    }, 30000);

    afterAll(async () => {
        if (db) await db.close(); // db에 close 메서드가 있다고 가정합니다.
        if (container) await container.stop();
    }, 30000);

    it('should fetch all posts', async () => {
        await db.insertPost({ title: 'Test1' });
        await db.insertPost({ title: 'Test2' });

        const posts = await postService.getAllPosts();

        expect(posts.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const { insertedId } = await db.insertPost({ title: 'Test' });

        const post = await postService.getDetailedPost(encodeURIComponent('Test'));

        expect(post).toEqual({ _id: insertedId, title: 'Test' });
    });
});
