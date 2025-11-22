import { vi } from "vitest";

export default class MockWorker {
  static instances: MockWorker[] = [];

  public onmessage: ((e: MessageEvent<any>) => void) | null = null;
  public onerror: ((e: ErrorEvent) => void) | null = null;

  public postMessage = vi.fn<(value: number) => void>();
  public terminate = vi.fn();

  constructor(_url: URL | string, _options?: WorkerOptions) {
    MockWorker.instances.push(this);
  }

  simulateMessage(data: {
    count: number;
    lastPrime: number;
    duration: number;
  }) {
    if (this.onmessage) {
      this.onmessage({ data } as MessageEvent);
    }
  }

  simulateError(error: any) {
    if (this.onerror) {
      this.onerror(error as any);
    }
  }
}
