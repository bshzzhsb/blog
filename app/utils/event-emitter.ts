type ParamType<T> = T extends (...args: infer P) => void ? P : [];

export class EventEmitter<Event extends number, Subscriber extends { [K in Event]: CallableFunction }> {
  private eventSubscribers = new Map<Event, Subscriber[Event][]>();

  subscribe<T extends Event>(event: T, subscriber: Subscriber[T]) {
    let subscribers = this.eventSubscribers.get(event);
    if (subscribers) {
      subscribers.push(subscriber);
    } else {
      subscribers = [subscriber];
      this.eventSubscribers.set(event, subscribers);
    }

    return () => {
      const index = subscribers?.findIndex(it => it === subscriber);
      if (index && index >= 0) {
        subscribers?.splice(index, 1);
      }
    };
  }

  emit<T extends Event>(event: T, values: ParamType<Subscriber[T]>) {
    const subscribers = this.eventSubscribers.get(event);
    subscribers?.forEach(subscriber => subscriber(...values));
  }
}
