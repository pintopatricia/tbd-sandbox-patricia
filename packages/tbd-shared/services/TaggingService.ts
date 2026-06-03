/**
 * Service for tracking which tagging events have been fired to prevent duplicates.
 * Each component should use its own instance for event deduplication.
 */
export class TaggingService {
  private firedEvents = new Set<string>();

  /**
   * Check if an event has already been fired
   */
  hasFired(eventId: string): boolean {
    return this.firedEvents.has(eventId);
  }

  /**
   * Mark an event as fired
   */
  markFired(eventId: string): void {
    this.firedEvents.add(eventId);
  }

  /**
   * Clear all fired events (useful for testing)
   */
  clear(): void {
    this.firedEvents.clear();
  }
}

// Singleton instances for each component
export const cardGroupTaggingService = new TaggingService();
export const jackpotTaggingService = new TaggingService();
export const gamesCardGroupTaggingService = new TaggingService();
