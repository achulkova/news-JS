import News from './news/news';
import Sources from './sources/sources';
import type { NewsResponse, SourcesResponse } from '../../types/api';

export class AppView {
    private readonly news: News;
    private readonly sources: Sources;

    public constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: NewsResponse): void {
        const articles = data.articles ?? [];
        this.news.draw(articles);
        this.setStatus(
            articles.length === 0 ? 'No articles found for this source.' : `${articles.length} stories available.`,
            articles.length === 0 ? 'empty' : 'success'
        );
    }

    public drawSources(data: SourcesResponse): void {
        const sources = data.sources ?? [];
        this.sources.draw(sources);
        this.setStatus(
            sources.length === 0 ? 'No news sources are available.' : 'Select a source to read the latest stories.',
            sources.length === 0 ? 'empty' : 'success'
        );
    }

    public selectSource(sourceId: string): void {
        this.sources.select(sourceId);
    }

    private setStatus(message: string, state: 'success' | 'empty'): void {
        const status = document.querySelector<HTMLElement>('.app-status');
        if (status) {
            status.textContent = message;
            status.className = `app-status app-status--${state}`;
        }
    }
}

export default AppView;
