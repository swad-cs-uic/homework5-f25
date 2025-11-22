/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

function isPrime(n: number): boolean {
  return false;
}

self.onmessage = (e: MessageEvent<number>) => {
  const limit = e.data;

  const start = null;
  const endTime = null;
  const count = null;
  const lastPrime = null;
  //TODO: Implement the prime counting logic here

  (self as any).postMessage({
    count: null,
    lastPrime: null,
    duration: null,
  });
};
