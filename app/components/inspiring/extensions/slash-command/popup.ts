import { autoUpdate, computePosition } from '@floating-ui/dom';

import { DisposerBag } from '~/utils/disposer-bag';

export class Popup {
  private element: HTMLDivElement;
  private disposers = new DisposerBag();

  constructor(child: Element, anchor: Element) {
    const element = document.createElement('div');
    element.style.display = '';
    element.style.position = 'absolute';
    element.appendChild(child);
    document.body.appendChild(element);
    this.element = element;

    const updatePosition = () => {
      computePosition(anchor, element, { placement: 'bottom-start' }).then(({ x, y }) => {
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
      });
    };
    this.disposers.add(autoUpdate(anchor, element, updatePosition));
  }

  destroy() {
    while (this.element.lastChild) {
      this.element.replaceChildren();
    }
    this.hide();
    document.body.removeChild(this.element);
    this.disposers.disposeAll();
  }

  get ref() {
    return this.element;
  }

  show() {
    this.element.style.display = 'block';
  }

  hide() {
    this.element.style.display = '';
  }
}
