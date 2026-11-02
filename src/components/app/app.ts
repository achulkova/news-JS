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
        this.controller.getSources((data: SourcesResponse) => this.view.drawSources(data));
    }
}

export default App;
