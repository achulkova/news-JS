import './sources.css';
import type { Source } from '../../../types/api';

class Sources {
    private readonly items: Source[] = [];
    private selectedSourceId = '';

    public constructor() {
        const search = document.querySelector<HTMLInputElement>('.source-search__input');
        search?.addEventListener('input', () => this.filter(search.value));
        document.querySelector<HTMLElement>('.sources')?.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const source = target.closest<HTMLElement>('.source__item');
            if (!source) return;
            const sourceId = source.dataset.sourceId;
            if (sourceId) {
                this.select(sourceId);
            }
        });
    }

    public draw(data: readonly Source[]): void {
        const container = document.querySelector<HTMLElement>('.sources');
        const template = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');
        if (!container || !template) {
            return;
        }

        this.items.splice(0, this.items.length, ...data);
        this.render(data, container, template);
    }

    public select(sourceId: string): void {
        this.selectedSourceId = sourceId;
        document.querySelectorAll<HTMLElement>('.source__item').forEach((item) => {
            const isSelected = item.dataset.sourceId === sourceId;
            item.classList.toggle('source__item--active', isSelected);
            item.setAttribute('aria-pressed', String(isSelected));
        });
    }

    private render(data: readonly Source[], container: HTMLElement, template: HTMLTemplateElement): void {
        const fragment = document.createDocumentFragment();
        data.forEach((item: Source) => {
            const sourceClone = template.content.cloneNode(true) as DocumentFragment;
            const sourceItem = sourceClone.querySelector<HTMLElement>('.source__item');
            const sourceName = sourceClone.querySelector<HTMLElement>('.source__item-name');
            if (sourceItem && sourceName) {
                sourceName.textContent = item.name;
                sourceItem.dataset.sourceId = item.id;
                sourceItem.setAttribute('aria-label', item.name);
                sourceItem.setAttribute('aria-pressed', String(item.id === this.selectedSourceId));
                sourceItem.classList.toggle('source__item--active', item.id === this.selectedSourceId);
                fragment.append(sourceClone);
            }
        });
        container.replaceChildren(fragment);
    }

    private filter(query: string): void {
        const container = document.querySelector<HTMLElement>('.sources');
        const template = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');
        if (!container || !template) return;
        const normalizedQuery = query.trim().toLocaleLowerCase();
        const filtered = this.items.filter((item) => item.name.toLocaleLowerCase().includes(normalizedQuery));
        this.render(filtered, container, template);
        if (filtered.length === 0) {
            container.innerHTML = '<p class="sources__empty">No sources found.</p>';
        }
    }
}

export default Sources;
