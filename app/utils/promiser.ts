export class Promiser<T> extends Promise<T> {
  handler?: { resolve: (value: T | PromiseLike<T>) => void; reject: (reason?: unknown) => void };

  constructor() {
    let handler: { resolve: (value: T | PromiseLike<T>) => void; reject: (reason?: unknown) => void } | undefined;
    super((resolve, reject) => {
      handler = { resolve, reject };
    });
    this.handler = handler;
  }

  static get [Symbol.species]() {
    return Promise;
  }

  resolve(value: T) {
    this.handler?.resolve(value);
  }

  reject(reason: unknown) {
    this.handler?.reject(reason);
  }
}
