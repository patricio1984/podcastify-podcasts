import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import Header from "../Header";

describe("Header", () => {
  const defaultProps = {
    searchQuery: "",
    setSearchQuery: () => {},
  };

  it("renders the header with title", () => {
    render(<Header {...defaultProps} />);

    const title = screen.getByText("Podcasts");
    expect(title).toBeInTheDocument();
  });

  it("applies correct header styles", () => {
    const { container } = render(<Header {...defaultProps} />);
    const header = container.firstChild;

    expect(header).toHaveClass("h-[70px]");
    expect(header).toHaveClass("relative");
    expect(header).toHaveClass("bg-white");
  });

  it("renders search bar component", () => {
    render(<Header {...defaultProps} />);

    const searchInput = screen.getByRole("searchbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("has correct layout styles", () => {
    const { container } = render(<Header {...defaultProps} />);
    const header = container.firstChild;

    expect(header).toHaveClass("h-[70px]");
    expect(header).toHaveClass("relative");
    expect(header).toHaveClass("bg-white");
  });
});
