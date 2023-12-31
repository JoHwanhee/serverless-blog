export class Post {
    private readonly id: string;
    private readonly owner: string;
    private readonly title: string;
    private readonly thumbnailUrl: string;
    private readonly description: string;
    private readonly content: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;

    constructor(builder: PostBuilder) {
        this.id = builder.Id;
        this.owner = builder.Owner;
        this.title = builder.Title;
        this.thumbnailUrl = builder.ThumbnailUrl;
        this.description = builder.Description;
        this.content = builder.Content;
        this.createdAt = builder.CreatedAt;
        this.updatedAt = builder.UpdatedAt;
    }

    public getFormattedCreatedAt(): string {
        const current = new Date();
        const postDate = new Date(this.createdAt);

        const diffInMs = current.getTime() - postDate.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours} 시간 전`;
        } else {
            return this._getFormattedCreatedAt();
        }
    }

    public isThumbnailDisplayable() {
        if (!this.thumbnailUrl) {
            return false
        }

        const urlPattern = /^(https?:\/\/)/; // HTTP or HTTPS URL pattern
        return urlPattern.test(this.thumbnailUrl);
    }

    private _getFormattedCreatedAt(): string {
        const date = new Date(this.createdAt);
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    }

    static get Builder() {
        return new PostBuilder();
    }

    // Getter methods
    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getThumbnailUrl(): string {
        return this.thumbnailUrl;
    }

    getDescription(): string {
        return this.description;
    }

    getContent(): string {
        return this.content;
    }
}


class PostBuilder {
    private id?: string;
    private title?: string;
    private thumbnailUrl?: string;
    private description?: string;
    private content?: string;
    private createdAt?: Date;
    private updatedAt?: Date;
    private owner?: string;

    get Owner(): string {
        return this.owner;
    }

    get Id() {
        return this.id;
    }

    get Title() {
        return this.title!;
    }

    get ThumbnailUrl() {
        return this.thumbnailUrl;
    }

    get Description() {
        return this.description;
    }

    get Content() {
        return this.content!;
    }

    get CreatedAt() {
        return this.createdAt || new Date();
    }

    get UpdatedAt() {
        return this.updatedAt || new Date();
    }

    withId(id: string) {
        this.id = id;
        return this;
    }

    withTitle(title: string) {
        this.title = title;
        return this;
    }

    withThumbnailUrl(thumbnailUrl: string) {
        this.thumbnailUrl = thumbnailUrl;
        return this;
    }

    withDescription(description: string) {
        this.description = description;
        return this;
    }

    withContent(content: string) {
        this.content = content;
        return this;
    }

    build(owner: string) {
        return new Post(this.withOwner(owner));
    }

    withOwner(owner: string) {
        this.owner = owner
        return this;
    }
}