import { GenericContainer } from 'testcontainers';
import { MongoClient } from 'mongodb';

describe('MongoDB tests with testcontainers', () => {
    let container;
    let client;
    let db;
    let collection;

    beforeAll(async () => {
        container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();

        const mappedPort = container.getMappedPort(27017);
        const host = container.getHost();

        const url = `mongodb://${host}:${mappedPort}`;
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db('testdb');
        collection = db.collection('documents');
    }, 30000);

    afterAll(async () => {
        await client.close();
        await container.stop();
    });

    test('should insert a document into MongoDB', async () => {
        const insertResult = await collection.insertOne({ name: 'test' });
        expect(insertResult.acknowledged).toBe(true);
    });

    test('should retrieve a document from MongoDB', async () => {
        const document = await collection.findOne({ name: 'test' });
        expect(document).toMatchObject({ name: 'test' });
    });
});
