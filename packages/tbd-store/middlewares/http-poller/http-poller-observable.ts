import URN from "../../state/layout/URN";
import HttpPoller from "./http-poller";
import debounce from "./debounce";

export type Observer<T> = (update: T) => void;

export default abstract class HttpPollerObservable<M, R> extends HttpPoller {
  private observers: Observer<R>[] = [];

  protected POOL = new Map<URN, { count: number } & M>();

  protected abstract tick(): Promise<void>;

  private debouncedTick;

  constructor(pollInterval: number, debounceTime = 500) {
    super(pollInterval);
    this.debouncedTick = debounce(async () => this.tick(), debounceTime);
  }

  protected add(id: URN, metadata: M): void {
    const existingEntry = this.POOL.get(id);

    const nextCount = existingEntry?.count || 0;
    this.POOL.set(id, { ...metadata, count: nextCount + 1 });

    // whenever as new Event is added, force a tick to fetch data for the new
    // Event but with small debounce for the case of multiple events being added
    // in simultaneous (ex. when user scrolls and multiple events enters the viewport)
    this.debouncedTick();
    this.start();
  }

  protected remove(id: URN): void {
    const existingEntry = this.POOL.get(id);
    if (existingEntry && existingEntry.count > 1) {
      this.POOL.set(id, {
        ...existingEntry,
        count: existingEntry.count - 1,
      });
    } else {
      this.POOL.delete(id);
    }
  }

  protected reset(): void {
    this.POOL.clear();
  }

  protected notify(payload: R) {
    this.observers.forEach((updateCb) => updateCb(payload));
  }

  public subscribe(updateCb: Observer<R>) {
    this.observers.push(updateCb);
  }

  protected async poll(): Promise<void> {
    if (this.POOL.size) {
      await this.tick();
    } else {
      this.stop();
    }
  }
}
