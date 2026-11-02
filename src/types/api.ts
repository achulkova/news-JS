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

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isArticleSource = (value: unknown): value is ArticleSource =>
    isRecord(value) &&
    typeof value.name === 'string' &&
    (value.id === undefined || value.id === null || typeof value.id === 'string');

const isArticle = (value: unknown): value is Article =>
    isRecord(value) &&
    isArticleSource(value.source) &&
    typeof value.title === 'string' &&
    typeof value.url === 'string' &&
    typeof value.publishedAt === 'string' &&
    (value.author === undefined || value.author === null || typeof value.author === 'string') &&
    (value.description === undefined || value.description === null || typeof value.description === 'string') &&
    (value.urlToImage === undefined || value.urlToImage === null || typeof value.urlToImage === 'string') &&
    (value.content === undefined || value.content === null || typeof value.content === 'string');

const isSource = (value: unknown): value is Source =>
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.description === undefined || typeof value.description === 'string') &&
    (value.url === undefined || typeof value.url === 'string') &&
    (value.category === undefined || typeof value.category === 'string') &&
    (value.language === undefined || typeof value.language === 'string') &&
    (value.country === undefined || typeof value.country === 'string');

type SuccessfulApiResponse = Record<string, unknown> & {
    readonly status: 'ok';
    readonly totalResults?: number;
    readonly articles?: unknown;
    readonly sources?: unknown;
};

const isSuccessfulResponse = (value: unknown): value is SuccessfulApiResponse =>
    isRecord(value) &&
    value.status === 'ok' &&
    (value.totalResults === undefined || typeof value.totalResults === 'number');

export const isApiErrorResponse = (value: unknown): value is { readonly status: 'error'; readonly message?: string } =>
    isRecord(value) && value.status === 'error' && (value.message === undefined || typeof value.message === 'string');

export const isNewsResponse = (value: unknown): value is NewsResponse =>
    isSuccessfulResponse(value) &&
    (value.articles === undefined || (Array.isArray(value.articles) && value.articles.every(isArticle)));

export const isSourcesResponse = (value: unknown): value is SourcesResponse =>
    isSuccessfulResponse(value) &&
    (value.sources === undefined || (Array.isArray(value.sources) && value.sources.every(isSource)));

export enum ApiEndpoint {
    Sources = 'sources',
    Everything = 'everything',
}

export interface RequestOptions {
    readonly endpoint: ApiEndpoint;
    readonly options?: Readonly<Record<string, string>>;
}

export type ResponseCallback<T> = (data: T) => void;
export type ResponseValidator<T> = (value: unknown) => value is T;
export type SourcePreview = Pick<Source, 'id' | 'name'>;
export type ArticleDraft = Partial<Pick<Article, 'author' | 'description' | 'urlToImage' | 'content'>>;
