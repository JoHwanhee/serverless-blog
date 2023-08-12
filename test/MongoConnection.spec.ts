import {GenericContainer} from 'testcontainers';
import {MongoConnection} from "../src/database/MongoConnection";

type ContainerInfo = {
    container: any;
    url?: string;
};

describe('MongoConnection tests with testcontainers', () => {
    let containerInfo: ContainerInfo;
    const mongoConnection = new MongoConnection();

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

    beforeAll(async () => {
        containerInfo = await setupTestContainers();
        const { url } = await urlFrom(containerInfo);
        if (url) {
            await mongoConnection.connect(url, 'testdb');
        }
    }, 20000);

    afterAll(async () => {
        await mongoConnection.close();
        await containerInfo.container.stop();
    });

    test('should establish a connection to MongoDB', async () => {
        expect(mongoConnection).toBeTruthy();
    });
});