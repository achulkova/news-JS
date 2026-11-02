import './sources.css';
import type { Source } from '../../../types/api';

class Sources {
    public draw(data: readonly Source[]): void {
        const container = document.querySelector<HTMLElement>('.sources');
        const template = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');
        if (!container || !template) {
            return;
        }

        const fragment = document.createDocumentFragment();
        data.forEach((item: Source) => {
            const sourceClone = template.content.cloneNode(true) as DocumentFragment;
            const sourceItem = sourceClone.querySelector<HTMLElement>('.source__item');
            const sourceName = sourceClone.querySelector<HTMLElement>('.source__item-name');
            if (sourceItem && sourceName) {
                sourceName.textContent = item.name;
                sourceItem.dataset.sourceId = item.id;
                sourceItem.setAttribute('role', 'listitem');
                fragment.append(sourceClone);
            }
        });
        container.replaceChildren(fragment);
    }
}

export default Sources;
