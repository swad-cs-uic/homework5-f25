import { useEffect, useRef, useState } from "react";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function countPrime(n: number) {
  let count = 0;
  let lastPrime = -1;

  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) {
      count++;
      lastPrime = i;
    }
  }
  return { count, lastPrime };
}

export default function Challenge2() {
  const [limit, setLimit] = useState(50000);
  const [result, setResult] = useState<{
    count: number;
    lastPrime: number;
    duration: number;
  } | null>(null);
  const [computing, setComputing] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    // Initialize the worker
    // Set up the message handler

    // Cleanup worker on unmount
    return () => {};
  }, []);

  const handleCompute = () => {
    // TODO: This blocks the main thread!
    // Your task is to move this computation to a Web Worker
    // Use the skeleton worker.ts in utils folder

    setComputing(true);
    const startTime = performance.now();

    const result = countPrime(limit);

    const endTime = performance.now();
    setResult({
      count: result.count,
      lastPrime: result.lastPrime,
      duration: endTime - startTime,
    });
    setComputing(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Challenge 2: Prime Counter (Web Worker)</h1>
      <p>
        Use a Web Worker to count how many prime numbers are less than or equal
        to a given limit, without blocking the UI.
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Instructions:</h3>
        <ol className="instructions">
          <li>
            Try limits like 10,000,000 to 50,000,000 to feel the difference.
          </li>
          <li>
            Click <strong>Count Primes</strong> and try to move the slider.
          </li>
          <li>Notice the UI freezes until the computation gets resolved.</li>
          <li>Try resolving it using Web Worker.</li>
        </ol>
      </div>

      <div style={{ marginTop: "10px" }}>
        <label htmlFor="prime-limit">Count primes up to: </label>
        <input
          id="prime-limit"
          type="number"
          value={limit}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setLimit(Number.isNaN(val) ? 0 : val);
          }}
          style={{ margin: "10px 0" }}
          aria-label="prime-limit"
        />
        <button
          onClick={handleCompute}
          disabled={computing}
          style={{ marginLeft: "10px" }}
        >
          {computing ? "Computing..." : "Count Primes"}
        </button>
      </div>

      <div style={{ margin: "20px 0" }}>
        <label htmlFor="dummy-slider">
          Try moving this slider while computing:
        </label>
        <input
          id="dummy-slider"
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          style={{
            width: "200px",
            marginLeft: "20px",
          }}
        />
        <span style={{ marginLeft: "10px" }}>
          Slider value: <strong>{sliderValue}</strong>
        </span>
      </div>

      {result && (
        <div>
          <p>
            Number of primes ≤ {limit}:{" "}
            <strong>{result.count.toLocaleString()}</strong>
          </p>
          <p>
            Largest prime ≤ {limit}:{" "}
            <strong>{result.lastPrime.toLocaleString()}</strong>
          </p>
          <p>Time taken (worker): {result.duration.toFixed(2)} ms</p>
        </div>
      )}

      {!computing && !result && (
        <p style={{ marginTop: "10px", fontStyle: "italic" }}>
          Click &quot;Count Primes&quot; to see the Web Worker in action.
        </p>
      )}
    </div>
  );
}
