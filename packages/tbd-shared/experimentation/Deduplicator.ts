// This is a temporary file while SDK does not exposure a deduplicator with browser support
type ExposureDeduplicatorEntry = {
  id: string;
  expiryTimestamp: number;
};

export class ExposureDeduplicator {
  private readonly ttl = 1000;
  readonly #cache = new Map<string, ExposureDeduplicatorEntry>();

  public isDuplicate(exposureId: string): boolean {
    const entry = this.#cache.get(exposureId);

    if (!entry) {
      return false;
    }

    const now = Date.now();

    if (now > entry.expiryTimestamp) {
      this.#cache.delete(exposureId);
      return false;
    }

    return true;
  }

  public addExposure(exposureId: string): void {
    const expiry = Date.now() + this.ttl;

    this.#cache.set(exposureId, {
      id: exposureId,
      expiryTimestamp: expiry,
    });
  }
}
