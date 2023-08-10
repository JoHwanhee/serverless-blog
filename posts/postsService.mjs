import {getPostById, getPosts} from "./posts.mjs";

async function getAllPosts() {
    return getPosts();
}

async function getDetailedPost(id) {
    return getPostById(id);
}

export { getAllPosts, getDetailedPost };
