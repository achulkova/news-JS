export interface Source {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly url?: string;
    readonly category?: string;
    readonly language?: string;
    readonly country?: string;
}

export interface ArticleSource {
    readonly id?: string | null;
    readonly name: string;
}

export interface Article {
    readonly source: ArticleSource;
    readonly author?: string | null;
    readonly title: string;
    readonly description?: string | null;
    readonly url: string;
    readonly urlToImage?: string | null;
    readonly publishedAt: string;
    readonly content?: string | null;
}

export interface ApiResponse<T> {
    readonly status: 'ok' | 'error';
    readonly totalResults?: number;
    readonly sources?: T extends Source ? T[] : never;
    readonly articles?: T extends Article ? T[] : never;
    readonly code?: string;
    readonly message?: string;
}

export type NewsResponse = ApiResponse<Article>;
export type SourcesResponse = ApiResponse<Source>;

export enum ApiEndpoint {
    Sources = 'sources',
    Everything = 'everything',
}

export interface RequestOptions {
    readonly endpoint: ApiEndpoint;
    readonly options?: Readonly<Record<string, string>>;
}

export type ResponseCallback<T> = (data: T) => void;
export type SourcePreview = Pick<Source, 'id' | 'name'>;
export type ArticleDraft = Partial<Pick<Article, 'author' | 'description' | 'urlToImage' | 'content'>>;
