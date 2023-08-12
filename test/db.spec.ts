import {GenericContainer} from 'testcontainers';
import {MongoClient} from 'mongodb';
import {pipe} from "../src/helper";

type ContainerInfo = {
    container: any;
    url?: string;
    client?: MongoClient;
    db?: any;
    sut?: any;
    dbName?: string;
    collectionName?: string;
};

describe('MongoDB tests with testcontainers', () => {
    let container;
    let client;
    let db;
    let sut;

    async function setupTestContainers(): Promise<ContainerInfo> {
        const container = await new GenericContainer('mongo')
            .withExposedPorts(27017)
            .start();
        return { container };
    }

    function urlFrom({ container }: ContainerInfo): Promise<ContainerInfo> {
        const mappedPort = container.getMappedPort(27017);
        const host = container.getHost();
        return Promise.resolve({ container, url: `mongodb://${host}:${mappedPort}` });
    }

    async function connect({ container, url }: ContainerInfo): Promise<ContainerInfo> {
        //@ts-ignore
        const client = await MongoClient.connect(url!, { useNewUrlParser: true, useUnifiedTopology: true });
        return { container, client };
    }

    function setupDatabase({ container, client, dbName = 'testdb' }: ContainerInfo): Promise<ContainerInfo> {
        const db = client!.db(dbName);
        return Promise.resolve({ container, client, db });
    }

    function setupCollection({ container, client, db, collectionName = 'documents' }: ContainerInfo): Promise<ContainerInfo> {
        const sut = db!.collection(collectionName);
        return Promise.resolve({ container, client, db, sut });
    }

    beforeAll(async () => {
        const setupMongoDBPipeline = pipe(
            setupTestContainers,
            urlFrom,
            connect,
            setupDatabase,
            setupCollection
        );
        const result = await setupMongoDBPipeline();
        container = result.container;
        client = result.client;
        db = result.db;
        sut = result.sut;

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
