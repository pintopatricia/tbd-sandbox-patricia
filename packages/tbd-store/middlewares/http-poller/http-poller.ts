import { onInternetStatusChange, getInternetStatus } from "./internet-status";

export default abstract class HttpPoller {
  private pollInterval: number;

  private intervalId: NodeJS.Timeout | null = null;

  private isOnline: boolean = getInternetStatus();

  protected abstract poll(): Promise<void>;

  constructor(pollInterval: number) {
    this.pollInterval = pollInterval;

    // Listen for online/offline events
    onInternetStatusChange(this.handleInternetStatusChange.bind(this));
  }

  private handleInternetStatusChange(isOnline: boolean): void {
    this.isOnline = isOnline;

    if (isOnline) {
      this.restart(); // Connection restored. Resuming polling.
    } else {
      this.stop(); // Connection lost. Pausing polling.
    }
  }

  protected setPollInterval(time: number) {
    this.pollInterval = time;
  }

  protected async start(): Promise<void> {
    if (this.isOnline && !this.intervalId) {
      this.intervalId = setInterval(() => this.poll(), this.pollInterval);
    }
  }

  protected stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  protected restart() {
    this.stop();
    this.poll();
    this.start();
  }
}
