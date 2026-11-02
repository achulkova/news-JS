import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import type { NewsResponse, SourcesResponse } from '../../types/api';

class App {
    private readonly controller: AppController;
    private readonly view: AppView;

    public constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        const sources = document.querySelector<HTMLElement>('.sources');
        if (!sources) {
            throw new Error('Sources container is missing');
        }

        sources.addEventListener('click', (event: MouseEvent) => {
            this.controller.getNews(event, (data: NewsResponse) => this.view.drawNews(data));
        });
        const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
        const navigation = document.querySelector<HTMLElement>('.site-nav');
        menuToggle?.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            navigation?.classList.toggle('site-nav--open', !isOpen);
        });
        navigation?.addEventListener('click', (event) => {
            if (event.target instanceof HTMLAnchorElement) {
                menuToggle?.setAttribute('aria-expanded', 'false');
                navigation.classList.remove('site-nav--open');
            }
        });
        this.controller.getSources((data: SourcesResponse) => {
            this.view.drawSources(data);
            const firstSource = data.sources?.[0];
            if (firstSource) {
                this.view.selectSource(firstSource.id);
                this.controller.getNewsBySource(firstSource.id, (news: NewsResponse) => this.view.drawNews(news));
            }
        });
    }
}

export default App;
