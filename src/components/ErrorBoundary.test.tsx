import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

const Boom = (): JSX.Element => {
  throw new Error("kaboom");
};

describe("ErrorBoundary", () => {
  let consoleError: jest.SpyInstance;

  beforeEach(() => {
    // React logs the caught error itself; silence it so the run stays readable.
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("renders its children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>
    );

    expect(screen.getByText("all good")).toBeInTheDocument();
  });

  it("renders the fallback when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reload the page" })
    ).toBeInTheDocument();
  });

  it("logs the error it caught", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(consoleError).toHaveBeenCalledWith(
      "Uncaught render error:",
      expect.objectContaining({ message: "kaboom" }),
      expect.anything()
    );
  });
});
