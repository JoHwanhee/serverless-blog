import { GenericContainer } from 'testcontainers';
import {IPostRepository} from "../src/posts/IPostRepository";
import {PostService} from "../src/posts/PostsService";
import {MongoPostRepository} from "../src/posts/MongoPostRepository";
import {MongoConnection} from "../src/database/MongoConnection";

describe('PostService', () => {
    let container;
    let repository: IPostRepository;
    let postService: PostService;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
        const db = await new MongoConnection()
            .connect(mongoUri, 'testdb')

        repository = new MongoPostRepository(db);
        postService = new PostService(repository);
    }, 30000);

    afterAll(async () => {
        if (container) await container.stop();
    }, 30000);

    it('should fetch all posts', async () => {
        await repository.insertPost({ title: 'Test1' });
        await repository.insertPost({ title: 'Test2' });

        const posts = await postService.getAllPosts();

        expect(posts.length).toBe(2);
    });

    it('should fetch post by id', async () => {
        const { insertedId } = await repository.insertPost({ title: 'Test' });

        const post = await postService.getDetailedPost(encodeURIComponent('Test'));

        expect(post).toEqual({ _id: insertedId, title: 'Test' });
    });
});
