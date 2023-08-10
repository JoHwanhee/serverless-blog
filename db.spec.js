import {GenericContainer} from 'testcontainers';
import {MongoClient} from 'mongodb';
import {pipe} from "./helper.mjs";

describe('MongoDB tests with testcontainers', () => {
    let container;
    let client;
    let db;
    let sut;

    async function setupTestContainers() {
        const container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        return { container };
    }

    function urlFrom({ container }) {
        const mappedPort = container.getMappedPort(27017);
        const host = container.getHost();
        return { container, url: `mongodb://${host}:${mappedPort}` };
    }

    async function connect({ container, url }) {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        return { container, client };
    }

    function setupDatabase({ container, client, dbName = 'testdb' }) {
        const db = client.db(dbName);
        return { container, client, db };
    }

    function setupCollection({ container, client, db, collectionName = 'documents' }) {
        const sut = db.collection(collectionName);
        return { container, client, db, sut };
    }

    beforeAll(async () => {
        ({ container, client, db, sut } = await pipe(
            setupTestContainers,
            urlFrom,
            connect,
            setupDatabase,
            setupCollection
        )());
    }, 30000);

    afterAll(async () => {
        await client.close();
        await container.stop();
    });

    test('should insert a document into MongoDB', async () => {
        const actual = await sut.insertOne({name: 'test'});

        expect(actual.acknowledged).toBe(true);
    });

    test('should retrieve a document from MongoDB', async () => {
        const actual = await sut.findOne({name: 'test'});

        expect(actual).toMatchObject({name: 'test'});
    });
});
