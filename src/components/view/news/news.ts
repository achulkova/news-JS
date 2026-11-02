import './news.css';
import type { Article } from '../../../types/api';
import placeholderImage from '../../../assets/news-placeholder.svg';

class News {
    public draw(data: readonly Article[]): void {
        const heroContainer = document.querySelector<HTMLElement>('.featured-news');
        const container = document.querySelector<HTMLElement>('.news');
        const cardTemplate = document.querySelector<HTMLTemplateElement>('#newsItemTemp');
        const heroTemplate = document.querySelector<HTMLTemplateElement>('#heroItemTemp');
        if (!heroContainer || !container || !cardTemplate || !heroTemplate) return;

        heroContainer.replaceChildren();
        container.replaceChildren();
        if (data.length === 0) return;

        const [featured, ...remaining] = data.slice(0, 10);
        heroContainer.append(this.renderHero(featured, heroTemplate));
        const grid = document.createElement('div');
        grid.className = 'news-grid';
        remaining.forEach((article) => grid.append(this.renderCard(article, cardTemplate)));
        container.append(grid);
    }

    private renderHero(article: Article, template: HTMLTemplateElement): DocumentFragment {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const image = this.required<HTMLImageElement>(fragment, '.featured-article__image');
        const source = this.required<HTMLElement>(fragment, '.featured-article__source');
        const date = this.required<HTMLElement>(fragment, '.featured-article__date');
        const title = this.required<HTMLElement>(fragment, '.featured-article__title');
        const description = this.required<HTMLElement>(fragment, '.featured-article__description');
        const link = this.required<HTMLAnchorElement>(fragment, '.featured-article__link');
        image.src = article.urlToImage || placeholderImage;
        image.alt = article.title;
        this.setImageFallback(image);
        source.textContent = article.source.name;
        date.textContent = this.formatDate(article.publishedAt);
        title.textContent = article.title;
        description.textContent = article.description || 'Read the latest story from this source.';
        this.setLink(link, article.url);
        return fragment;
    }

    private renderCard(article: Article, template: HTMLTemplateElement): DocumentFragment {
        const fragment = template.content.cloneNode(true) as DocumentFragment;
        const image = this.required<HTMLImageElement>(fragment, '.news-card__image');
        const imageLink = this.required<HTMLAnchorElement>(fragment, '.news-card__image-link');
        const source = this.required<HTMLElement>(fragment, '.news-card__source');
        const date = this.required<HTMLElement>(fragment, '.news-card__date');
        const title = this.required<HTMLElement>(fragment, '.news-card__title');
        const description = this.required<HTMLElement>(fragment, '.news-card__description');
        const link = this.required<HTMLAnchorElement>(fragment, '.news-card__link');
        image.src = article.urlToImage || placeholderImage;
        image.alt = article.title;
        this.setImageFallback(image);
        this.setLink(imageLink, article.url);
        source.textContent = article.source.name;
        date.textContent = this.formatDate(article.publishedAt);
        title.textContent = article.title;
        description.textContent = article.description || 'No description available.';
        this.setLink(link, article.url);
        return fragment;
    }

    private required<T extends Element>(fragment: DocumentFragment, selector: string): T {
        const element = fragment.querySelector<T>(selector);
        if (!element) throw new Error(`Missing article template element: ${selector}`);
        return element;
    }

    private setImageFallback(image: HTMLImageElement): void {
        image.addEventListener(
            'error',
            () => {
                image.src = placeholderImage;
            },
            { once: true }
        );
    }

    private setLink(link: HTMLAnchorElement, url: string): void {
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }

    private formatDate(value: string): string {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString();
    }
}

export default News;
