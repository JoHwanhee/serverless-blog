import { createDatabaseConnection, initializeApp } from "./index";
import { GenericContainer } from 'testcontainers';

import { execSync } from 'child_process';

function removeMongoContainers() {
    try {
        const command = 'docker ps -a -q --filter ancestor=mongo | xargs docker rm -f';
        execSync(command);
        console.log('Previous mongo containers removed.');
    } catch (error) {
        console.error('Failed to remove previous mongo containers:', error);
    }
}


async function startServer() {
    // removeMongoContainers();

    const container = await new GenericContainer('mongo')
        .withExposedPorts(27017)
        .start();
    const mongoUri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;

    const dbConnection = await createDatabaseConnection(mongoUri, "testDb");
    const app = await initializeApp(dbConnection);

    app.listen(3000, () => {
        console.log('App is running on http://localhost:3000');
    }).emit(("close"), () => {
        dbConnection.close()
        container.stop()
        console.log('App is closed');
    });
}

startServer();
