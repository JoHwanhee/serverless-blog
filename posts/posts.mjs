import { MongoClient } from 'mongodb';

async function connect(connectionString = 'YOUR_MONGODB_URL', dbName = 'YOUR_DB_NAME') {
    const client = await MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    return client.db(dbName);
}

async function getPosts(db) {
    return db.collection('posts').find({}).toArray();
}

async function getPostById(db, id) {
    return db.collection('posts').findOne({ _id: id });
}

async function insertPost(db, document) {
    const res = await db.collection('posts').insertOne(document);
    return res
}

export { connect, getPosts, getPostById, insertPost };