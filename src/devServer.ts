import { createDatabaseConnection, initializeApp } from "./index";
import { GenericContainer } from 'testcontainers';

async function startServer() {
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
