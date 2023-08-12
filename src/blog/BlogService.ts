import {IBlogRepository} from "./IBlogRepository";

export class BlogService {

    private db: IBlogRepository;

    constructor(database: IBlogRepository) {
        this.db = database;
    }

    async getBlog(owner: string) {
        // todo : auth

        return await this.db.getBlog(owner);
    }
}