import AppLoader from './appLoader';
import { ApiEndpoint } from '../../types/api';
import type { NewsResponse, ResponseCallback, SourcesResponse } from '../../types/api';

class AppController extends AppLoader {
    public getSources(callback: ResponseCallback<SourcesResponse>): void {
        this.getResp<SourcesResponse>({ endpoint: ApiEndpoint.Sources }, callback);
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
        if (!sourceId || newsContainer.dataset.source === sourceId) {
            return;
        }

        newsContainer.dataset.source = sourceId;
        this.getResp<NewsResponse>({ endpoint: ApiEndpoint.Everything, options: { sources: sourceId } }, callback);
    }
}

export default AppController;
