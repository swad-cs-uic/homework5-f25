import { Profiler, type ProfilerOnRenderCallback } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import {
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
  describe,
  test,
  expect,
} from "vitest";
import userEvent from "@testing-library/user-event";
import Challenge1 from "../src/components/Challenge1";
import Challenge2 from "../src/components/Challenge2";
import Challenge3 from "../src/components/Challenge3";
import Challenge4 from "../src/components/Challenge4";

import MockWorker from "./__mocks__/Worker";
import sumOfSquares from "../src/utils/sumOfSquares";

beforeAll(() => {
  vi.stubGlobal("Worker", MockWorker as unknown as typeof Worker);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

vi.mock("react-window", () => {
  return {
    List: ({ rowComponent: Row, rowCount, rowProps }: any) => {
      const visibleCount = Math.min(rowCount, 10);
      const items = [];

      for (let i = 0; i < visibleCount; i++) {
        items.push(<Row key={i} index={i} style={{}} {...rowProps} />);
      }

      return <div data-testid="virtual-list">{items}</div>;
    },
  };
});

(globalThis as any).Worker = MockWorker;

// ============================================================
// Challenge 1 tests - UseMemo
// ============================================================

describe("Challenge1: useMemo optimization", () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    vi.mock("../src/utils/sumOfSquares", { spy: true });
  });

  test("(10pts) Heavy computation runs only when input value changes", () => {
    const onRender = vi.fn();

    render(
      <Profiler id="Challenge1Profiler" onRender={onRender}>
        <Challenge1 />
      </Profiler>
    );

    const numberInput = screen.getByLabelText(/Input number/i);

    const unrelatedButton = screen.getByRole("button", {
      name: /Increment unrelated counter/i,
    });

    expect(sumOfSquares).toHaveBeenCalledTimes(1);
    expect(sumOfSquares).toHaveBeenCalledWith(10);
    expect(sumOfSquares).toHaveReturnedWith(385);

    fireEvent.change(numberInput, { target: { value: "5" } });
    expect(sumOfSquares).toHaveBeenCalledTimes(2);
    expect(sumOfSquares).toHaveBeenCalledWith(5);
    expect(sumOfSquares).toHaveReturnedWith(55);

    fireEvent.change(numberInput, { target: { value: "7" } });
    expect(sumOfSquares).toHaveBeenCalledTimes(3);
    expect(sumOfSquares).toHaveBeenCalledWith(7);
    expect(sumOfSquares).toHaveReturnedWith(140);

    fireEvent.click(unrelatedButton);
    expect(sumOfSquares).toHaveBeenCalledTimes(3);
  });

  test("(15pts) Updating unrelated state does NOT rerun heavy computation", () => {
    vi.resetAllMocks();
    const onRender = vi.fn();

    render(
      <Profiler id="Challenge1Profiler" onRender={onRender}>
        <Challenge1 />
      </Profiler>
    );

    const numberInput = screen.getByLabelText(/Input number/i);
    const unrelatedButton = screen.getByRole("button", {
      name: /Increment unrelated counter/i,
    });

    expect(sumOfSquares).toHaveBeenCalledTimes(1);

    fireEvent.change(numberInput, { target: { value: "6" } });
    expect(sumOfSquares).toHaveBeenCalledTimes(2);

    fireEvent.click(unrelatedButton);
    expect(sumOfSquares).toHaveBeenCalledTimes(2);

    fireEvent.click(unrelatedButton);
    expect(sumOfSquares).toHaveBeenCalledTimes(2);

    fireEvent.change(numberInput, { target: { value: "8" } });
    expect(sumOfSquares).toHaveBeenCalledTimes(3);
    expect(sumOfSquares).toHaveBeenCalledWith(8);
    expect(sumOfSquares).toHaveReturnedWith(204);
  });
});

// ============================================================
// Challenge 2 tests – Web Worker
// ============================================================

describe("Challenge2: Prime Counter (Web Worker)", () => {
  beforeEach(() => {
    MockWorker.instances = [];
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("(20pts) Renders correctly and handles prime numbers computation via Web Worker", async () => {
    const renderCounts: number[] = [];
    const onRender: ProfilerOnRenderCallback = () => {
      renderCounts.push(renderCounts.length + 1);
    };

    render(
      <Profiler id="Challenge2Profiler" onRender={onRender}>
        <Challenge2 />
      </Profiler>
    );

    expect(
      screen.getByText("Challenge 2: Prime Counter (Web Worker)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Count Primes/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Count primes up to:/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Try moving this slider while computing:/i)
    ).toBeInTheDocument();

    expect(MockWorker.instances.length).toBe(1);
    const mockWorkerInstance = MockWorker.instances[0];

    // Simulate user input and button click
    const numberInput = screen.getByLabelText(
      /Count primes up to:/i
    ) as HTMLInputElement;
    const countButton = screen.getByRole("button", {
      name: /Count Primes/i,
    });

    fireEvent.change(numberInput, { target: { value: "100000" } });
    expect(numberInput.value).toBe("100000");

    fireEvent.click(countButton);
    expect(countButton).toBeDisabled();
    expect(countButton).toHaveTextContent("Computing...");
    expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith(100000);

    const mockResult = { count: 9592, lastPrime: 99991, duration: 42.5 };
    await act(async () => {
      mockWorkerInstance.simulateMessage(mockResult);
    });

    await waitFor(() => {
      expect(screen.getByText(/Number of primes ≤ 100000:/i)).toBeVisible();
      expect(screen.getByText(/9,592/)).toBeVisible();

      expect(screen.getByText(/Largest prime ≤ 100000:/i)).toBeVisible();
      expect(screen.getByText(/99,991/)).toBeVisible();

      expect(screen.getByText(/Time taken \(worker\):/i)).toBeVisible();

      expect(countButton).toBeEnabled();
      expect(countButton).toHaveTextContent("Count Primes");
    });

    expect(renderCounts.length).toBeGreaterThanOrEqual(3);
  });

  test("(5pts) Profiler tracks render counts for key interactions", async () => {
    const onRender = vi.fn<ProfilerOnRenderCallback>();

    render(
      <Profiler id="Challenge2Profiler" onRender={onRender}>
        <Challenge2 />
      </Profiler>
    );

    expect(MockWorker.instances.length).toBe(1);
    const mockWorkerInstance = MockWorker.instances[0];

    const numberInput = screen.getByLabelText(
      /Count primes up to:/i
    ) as HTMLInputElement;
    const countButton = screen.getByRole("button", {
      name: /Count Primes/i,
    });

    fireEvent.change(numberInput, { target: { value: "20000" } });

    fireEvent.click(countButton);

    const mockResult = { count: 2262, lastPrime: 19997, duration: 15.3 };
    await act(async () => {
      mockWorkerInstance.simulateMessage(mockResult);
    });

    await waitFor(() => {
      expect(onRender).toHaveBeenCalledTimes(4);
    });
  });
});

// ============================================================
// Challenge 3 tests - UseCallback implementation
// ============================================================

describe("Challenge3: useCallback with memoized contact list", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    vi.restoreAllMocks();
  });

  test("(5pts) Toggling a contact online status re-renders only that contact", () => {
    render(<Challenge3 />);

    consoleLogSpy.mockClear();

    const toggleButtons = screen.getAllByRole("button", {
      name: /Toggle Status/i,
    });

    fireEvent.click(toggleButtons[0]);

    const hasContact0Render = consoleLogSpy.mock.calls.some(
      (args: any) =>
        typeof args[0] === "string" &&
        args[0].includes("Rendering ContactItem 0")
    );
    expect(hasContact0Render).toBe(true);

    const hasContact5Render = consoleLogSpy.mock.calls.some(
      (args: any) =>
        typeof args[0] === "string" &&
        args[0].includes("Rendering ContactItem 5")
    );
    expect(hasContact5Render).toBe(false);

    consoleLogSpy.mockClear();
    fireEvent.click(toggleButtons[5]);

    const hasContact5RenderAfter = consoleLogSpy.mock.calls.some(
      (args: any) =>
        typeof args[0] === "string" &&
        args[0].includes("Rendering ContactItem 5")
    );
    expect(hasContact5RenderAfter).toBe(true);
  }, 25000);

  test("(10pts) Pinging a contact does not re-render the entire list", () => {
    render(<Challenge3 />);

    consoleLogSpy.mockClear();

    const pingButtons = screen.getAllByRole("button", {
      name: /Ping/i,
    });

    fireEvent.click(pingButtons[0]);

    const hasPingLog = consoleLogSpy.mock.calls.some(
      (args: any) =>
        typeof args[0] === "string" &&
        args[0].includes("Ping sent to contact 0")
    );
    expect(hasPingLog).toBe(true);

    const hasRenderLogs = consoleLogSpy.mock.calls.some(
      (args: any) =>
        typeof args[0] === "string" && args[0].includes("Rendering ContactItem")
    );
    expect(hasRenderLogs).toBe(false);
  }, 25000);

  test("(10pts) Toggling 'Show online only' does not re-render unchanged contacts", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.9);

    render(<Challenge3 />);

    consoleLogSpy.mockClear();

    const checkbox = screen.getByLabelText(/Show online only/i);

    fireEvent.click(checkbox);

    expect(consoleLogSpy).not.toHaveBeenCalled();

    randomSpy.mockRestore();
  });
}, 25000);

// ============================================================
// Challenge 4 tests - List Virtualization
// ============================================================

describe("Challenge4: Filtered Virtualized Movies", () => {
  test("(10pts) Uses virtualization to avoid rendering all rows", () => {
    const initialCount = 1000;
    render(<Challenge4 initialCount={initialCount} />);

    const countLabel = screen.getByTestId("challenge4-count");
    expect(countLabel).toHaveTextContent("Showing 1,000 movies");

    const rows = screen.getAllByTestId(/movie-row-/);

    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(initialCount);
  });

  test("(15pts) Search filters movies and toggles empty state", async () => {
    const user = userEvent.setup();
    render(<Challenge4 initialCount={1000} />);

    const searchInput = screen.getByTestId("challenge4-search-input");

    expect(screen.getByTestId("challenge4-list-wrapper")).toBeInTheDocument();
    expect(screen.queryByTestId("challenge4-empty")).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, "ZebraXYZ");

    expect(screen.getByTestId("challenge4-empty")).toBeInTheDocument();
    expect(
      screen.queryByTestId("challenge4-list-wrapper")
    ).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.type(searchInput, "Action");

    expect(screen.getByTestId("challenge4-list-wrapper")).toBeInTheDocument();
    expect(screen.queryByTestId("challenge4-empty")).not.toBeInTheDocument();
  });
});
