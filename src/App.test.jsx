import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("renders the core portfolio sections", () => {
    render(<App />);

    expect(screen.getByText("Hi I'm Graeme.")).toBeInTheDocument();
    expect(screen.getByText("A Lead Software Engineer.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Hi I'm Graeme. A Lead Software Engineer."
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Skip to main content" })
    ).toHaveAttribute("href", "#main-content");
    expect(
      screen.getByText("Diageo | April 2023 to present")
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Impact" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view experience/i })
    ).toHaveAttribute("href", "#experience");
    expect(
      screen.getByRole("link", { name: /download cv/i })
    ).toHaveAttribute("href", expect.stringContaining("_green.pdf"));
    expect(
      screen.getByRole("link", { name: /download my cv/i })
    ).toHaveAttribute("href", expect.stringContaining("_green.pdf"));
    expect(
      screen.getByRole("link", { name: /linkedin/i })
    ).toHaveAttribute("href", "https://www.linkedin.com/in/ghaddow64/");
    expect(screen.getByRole("img", { name: "Graeme Haddow" })).toHaveAttribute(
      "fetchpriority",
      "high"
    );
  });

  it("persists the selected colour theme", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("portfolio-theme")).toBe("dark");
  });

  it("exposes the mobile navigation as a keyboard-accessible disclosure", async () => {
    const user = userEvent.setup();
    render(<App />);

    const openButton = screen.getByRole("button", {
      name: "Open navigation",
    });
    expect(openButton).toHaveAttribute(
      "aria-controls",
      "primary-navigation-links"
    );
    expect(openButton).toHaveAttribute("aria-expanded", "false");

    await user.click(openButton);
    expect(
      screen.getByRole("button", { name: "Close navigation" })
    ).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("button", { name: "Open navigation" })
    ).toHaveAttribute("aria-expanded", "false");
  });
});
