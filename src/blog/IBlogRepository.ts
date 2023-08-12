import {Blog} from "./Blog";

export interface IBlogRepository {
    getBlog(owner: string): Promise<Blog>;
}