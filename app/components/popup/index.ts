import { ComputePositionConfig, ReferenceElement, autoUpdate, computePosition } from '@floating-ui/dom';

import { DisposerBag } from '~/utils/disposer-bag';

export class Popup {
  private element: HTMLDivElement;
  private anchor: ReferenceElement;
  private parent: HTMLElement;
  private readonly options?: Partial<ComputePositionConfig>;
  private disposers = new DisposerBag();

  constructor(
    child: Element,
    anchor: ReferenceElement,
    options?: Partial<ComputePositionConfig>,
    parent: HTMLElement = document.body,
  ) {
    const element = document.createElement('div');
    element.style.display = 'none';
    element.style.position = 'absolute';
    element.appendChild(child);
    this.parent = parent;
    this.parent.appendChild(element);
    this.element = element;
    this.anchor = anchor;
    this.options = options;

    const updatePosition = () => {
      computePosition(anchor, element, options).then(({ x, y }) => {
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
      });
    };
    this.disposers.add(autoUpdate(anchor, element, updatePosition));
  }

  destroy() {
    this.element.replaceChildren();
    this.hide();
    if (this.element.parentElement === this.parent) {
      this.parent.removeChild(this.element);
    }
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
    computePosition(anchor, element, this.options).then(({ x, y }) => {
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    });
  }
}
