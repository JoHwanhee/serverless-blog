import {Post} from "./Post";

export interface IPostRepository {
    getPosts(owner: string): Promise<Post[]>;
    getPostById(id: any): Promise<Post | null>;
    getPostByTitle(owner: string, title: any): Promise<Post | null>;
    insertPost(document: any): Promise<string>;
    clear(): Promise<any>;
}