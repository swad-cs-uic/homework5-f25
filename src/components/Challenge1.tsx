import { useMemo, useState } from "react";
import sumOfSquares from "../utils/sumOfSquares";

function heavyComputation(n: number): number {
  console.log("🔴 Running heavyComputation for n =", n);

  return sumOfSquares(n);
}

export default function Challenge1() {
  const [input, setInput] = useState(10);
  const [unrelatedCounter, setUnrelatedCounter] = useState(0);

  const result = () => {
    return heavyComputation(input);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "1.5rem",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h1>Challenge 1 : Optimize Expensive Calculations using useMemo</h1>

      <p>
        Open the <b>Console</b> in DevTools to see when the heavy computation
        actually runs.
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Instructions:</h3>
        <ol className="instructions">
          <li>
            Enter a number to calculate sum of squares till the number entered.
          </li>
          <li>Click the "Increment unrelated counter" button.</li>
          <li>
            "🔴 Running heavyComputation for n = ..." should print to the
            console only when the number changes.
          </li>
        </ol>
      </div>
      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>Expensive Calculation</h2>
        <label>
          Input number:{" "}
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(Number(e.target.value) || 0)}
            style={{ width: 80 }}
          />
        </label>

        <p style={{ marginTop: "0.75rem" }}>
          {/* TODO: Optimize the result to use useMemo for memoised computations */}
          <b>Sum of squares from 1 to {input}:</b> {result()}
        </p>
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>Unrelated State</h2>
        <p>
          This button updates an <b>unrelated</b> counter. Thanks to{" "}
          <code>useMemo</code>, the heavy computation will <b>not run again</b>{" "}
          when you only change this counter.
        </p>
        <button onClick={() => setUnrelatedCounter((c) => c + 1)}>
          Increment unrelated counter ({unrelatedCounter})
        </button>
      </div>
    </div>
  );
}
