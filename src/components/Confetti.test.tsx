import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Confetti from "./Confetti";

// Mock react-confetti
vi.mock("react-confetti", () => ({
  default: vi.fn(() => <div data-testid="mock-confetti" />),
}));

// Mock useWindowSize hook
vi.mock("react-use", () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));

describe("Confetti Component", () => {
  it("should not render when show is false", () => {
    const { queryByTestId } = render(<Confetti show={false} />);

    expect(queryByTestId("mock-confetti")).not.toBeInTheDocument();
  });

  it("should render when show is true", () => {
    const { getByTestId } = render(<Confetti show={true} />);

    expect(getByTestId("mock-confetti")).toBeInTheDocument();
  });
});
