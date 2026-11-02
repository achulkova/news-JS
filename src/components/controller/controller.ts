import AppLoader from './appLoader';
import { ApiEndpoint, isNewsResponse, isSourcesResponse } from '../../types/api';
import type { NewsResponse, ResponseCallback, SourcesResponse } from '../../types/api';

class AppController extends AppLoader {
    private newsRequestId = 0;

    public getSources(callback: ResponseCallback<SourcesResponse>): void {
        this.getResp<SourcesResponse>({ endpoint: ApiEndpoint.Sources }, callback, isSourcesResponse);
    }

    public getNews(event: MouseEvent, callback: ResponseCallback<NewsResponse>): void {
        const target = event.target;
        const newsContainer = event.currentTarget;
        if (!(target instanceof Element) || !(newsContainer instanceof HTMLElement)) {
            return;
        }

        const source = target.closest<HTMLElement>('.source__item');
        if (!source || !newsContainer.contains(source)) {
            return;
        }

        const sourceId = source.dataset.sourceId;
        if (!sourceId) {
            return;
        }

        this.getNewsBySource(sourceId, callback, newsContainer);
    }

    public getNewsBySource(
        sourceId: string,
        callback: ResponseCallback<NewsResponse>,
        newsContainer?: HTMLElement
    ): void {
        const container = newsContainer ?? document.querySelector<HTMLElement>('.sources');
        if (!container || container.dataset.source === sourceId) {
            return;
        }

        container.dataset.source = sourceId;
        const requestId = ++this.newsRequestId;
        this.getResp<NewsResponse>(
            { endpoint: ApiEndpoint.Everything, options: { sources: sourceId } },
            callback,
            isNewsResponse,
            () => requestId === this.newsRequestId,
            () => {
                if (requestId === this.newsRequestId) {
                    delete container.dataset.source;
                }
            }
        );
    }
}

export default AppController;
