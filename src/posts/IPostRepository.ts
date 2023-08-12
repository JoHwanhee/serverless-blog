
export interface IPostRepository {
    getPosts(): Promise<any[]>;
    getPostById(id: any): Promise<any>;
    getPostByTitle(title: any): Promise<any>;
    insertPost(document: any): Promise<any>;
    clear(): Promise<any>;
}
