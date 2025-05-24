import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSearch } from "../useSearch";
import { TestWrapper } from "../../../test/test-utils";

describe("useSearch", () => {
  const mockOnQueryChange = vi.fn();
  const initialTestQuery = "";

  it("should initialize with search closed and provided query", () => {
    const { result } = renderHook(
      () => useSearch(initialTestQuery, mockOnQueryChange),
      {
        wrapper: TestWrapper,
      }
    );

    expect(result.current.searchOpen).toBe(false);
    expect(result.current.searchQuery).toBe(initialTestQuery);
    expect(mockOnQueryChange).not.toHaveBeenCalled();
  });

  it("should open search when handleSearchButtonClick is called", () => {
    const { result } = renderHook(
      () => useSearch(initialTestQuery, mockOnQueryChange),
      {
        wrapper: TestWrapper,
      }
    );

    act(() => {
      result.current.handleSearchButtonClick();
    });

    expect(result.current.searchOpen).toBe(true);
  });

  it("should call onQueryChange when handleInputChange is called", () => {
    const { result } = renderHook(
      () => useSearch(initialTestQuery, mockOnQueryChange),
      {
        wrapper: TestWrapper,
      }
    );

    const testValue = "new query";
    act(() => {
      result.current.handleInputChange({
        target: { value: testValue },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(mockOnQueryChange).toHaveBeenCalledWith(testValue);
  });

  it("should prevent default on form submission", () => {
    const { result } = renderHook(
      () => useSearch(initialTestQuery, mockOnQueryChange),
      {
        wrapper: TestWrapper,
      }
    );
    const mockPreventDefault = vi.fn();

    act(() => {
      result.current.handleFormSubmit({
        preventDefault: mockPreventDefault,
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it("should close search when clicked outside the form", () => {
    const mockForm = document.createElement("form");
    const mockEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mockEvent, "target", { value: document.body });

    const { result } = renderHook(
      () => useSearch(initialTestQuery, mockOnQueryChange),
      {
        wrapper: TestWrapper,
      }
    );

    result.current.formRef.current = mockForm;

    act(() => {
      result.current.handleSearchButtonClick();
    });
    expect(result.current.searchOpen).toBe(true);

    act(() => {
      document.dispatchEvent(mockEvent);
    });

    expect(result.current.searchOpen).toBe(false);
  });
});
