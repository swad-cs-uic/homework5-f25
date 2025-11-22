import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Clean the DOM after each test
afterEach(() => {
  cleanup();
});
