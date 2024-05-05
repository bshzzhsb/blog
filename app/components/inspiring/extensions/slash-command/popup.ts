import { ReferenceElement, autoUpdate, computePosition } from '@floating-ui/dom';

import { DisposerBag } from '~/utils/disposer-bag';

export class Popup {
  private element: HTMLDivElement;
  private anchor: ReferenceElement;
  private disposers = new DisposerBag();

  constructor(child: Element, anchor: ReferenceElement) {
    console.log('new popup', child);

    const element = document.createElement('div');
    element.style.display = 'none';
    element.style.position = 'absolute';
    element.appendChild(child);
    document.body.appendChild(element);
    this.element = element;
    this.anchor = anchor;

    if (anchor instanceof Element) {
      const updatePosition = () => {
        computePosition(anchor, element, { placement: 'bottom-start' }).then(({ x, y }) => {
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
        });
      };
      this.disposers.add(autoUpdate(anchor, element, updatePosition));
    }
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
    this.element.style.display = 'none';
  }

  updatePosition() {
    const { element, anchor } = this;
    computePosition(anchor, element, { placement: 'bottom-start' }).then(({ x, y }) => {
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    });
  }
}
