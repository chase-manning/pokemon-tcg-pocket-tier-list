import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { UIProvider, useUI } from "../UIContext";

const Consumer = () => {
  const { isNavOpen, toggleNav } = useUI();
  return (
    <div>
      <span data-testid="navopen">{String(isNavOpen)}</span>
      <button onClick={toggleNav}>toggle-nav</button>
    </div>
  );
};

const renderUI = () =>
  render(
    <UIProvider>
      <Consumer />
    </UIProvider>
  );

describe("UIProvider", () => {
  it("starts with the mobile nav closed", () => {
    renderUI();
    expect(screen.getByTestId("navopen")).toHaveTextContent("false");
  });

  it("opens and closes the mobile nav", () => {
    renderUI();
    fireEvent.click(screen.getByRole("button", { name: "toggle-nav" }));
    expect(screen.getByTestId("navopen")).toHaveTextContent("true");
    fireEvent.click(screen.getByRole("button", { name: "toggle-nav" }));
    expect(screen.getByTestId("navopen")).toHaveTextContent("false");
  });
});