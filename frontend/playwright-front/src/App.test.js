import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renders the home page hero", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByRole("heading", {
    name: /AI-Powered Test Automation/i,
  });
  expect(heading).toBeInTheDocument();
});
