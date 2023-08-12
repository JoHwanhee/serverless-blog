import {Post} from "./Post";

export interface IPostRepository {
    getPosts(): Promise<Post[]>;
    getPostById(id: any): Promise<Post | null>;
    getPostByTitle(title: any): Promise<Post | null>;
    insertPost(document: any): Promise<string>;
    clear(): Promise<any>;
}