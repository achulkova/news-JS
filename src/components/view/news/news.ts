import './news.css';
import type { Article } from '../../../types/api';

class News {
    public draw(data: readonly Article[]): void {
        const container = document.querySelector<HTMLElement>('.news');
        const template = document.querySelector<HTMLTemplateElement>('#newsItemTemp');
        if (!container || !template) {
            return;
        }

        const fragment = document.createDocumentFragment();
        data.slice(0, 10).forEach((item: Article, index: number) => {
            const newsClone = template.content.cloneNode(true) as DocumentFragment;
            const newsItem = newsClone.querySelector<HTMLElement>('.news__item');
            const photo = newsClone.querySelector<HTMLElement>('.news__meta-photo');
            const author = newsClone.querySelector<HTMLElement>('.news__meta-author');
            const date = newsClone.querySelector<HTMLElement>('.news__meta-date');
            const title = newsClone.querySelector<HTMLElement>('.news__description-title');
            const source = newsClone.querySelector<HTMLElement>('.news__description-source');
            const description = newsClone.querySelector<HTMLElement>('.news__description-content');
            const link = newsClone.querySelector<HTMLAnchorElement>('.news__read-more a');
            if (!newsItem || !photo || !author || !date || !title || !source || !description || !link) {
                return;
            }

            newsItem.classList.toggle('alt', index % 2 === 1);
            photo.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
            photo.setAttribute('aria-label', item.title);
            author.textContent = item.author || item.source.name;
            date.textContent = this.formatDate(item.publishedAt);
            title.textContent = item.title;
            source.textContent = item.source.name;
            description.textContent = item.description || 'No description available.';
            link.href = item.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            fragment.append(newsClone);
        });
        container.replaceChildren(fragment);
    }

    private formatDate(value: string): string {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString();
    }
}

export default News;
