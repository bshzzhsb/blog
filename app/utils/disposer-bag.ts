export class DisposerBag {
  private disposers = new Set<CallableFunction>();

  add(...disposers: CallableFunction[]) {
    disposers.forEach(disposer => this.disposers.add(disposer));
  }

  disposeAll() {
    this.disposers.forEach(disposer => disposer());
    this.disposers.clear();
  }
}
