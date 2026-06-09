import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import * as hooks from "../../api/nutrition/use-nutrition-logs";
import { RouteComponent } from "./index";

vi.mock("../../api/nutrition/use-nutrition-logs");

const mockLogs = [
  {
    _id: "1",
    user: "u1",
    date: "2026-06-09T00:00:00.000Z",
    calories: 500,
    protein: 30,
    carbs: 50,
    fat: 20,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "2",
    user: "u1",
    date: "2026-06-09T00:00:00.000Z",
    calories: 300,
    protein: 20,
    carbs: 30,
    fat: 10,
    label: "Lunch",
    category: "meat",
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "3",
    user: "u1",
    date: "2026-06-08T00:00:00.000Z",
    calories: 700,
    protein: 50,
    carbs: 60,
    fat: 25,
    createdAt: "",
    updatedAt: "",
  },
];

const mockCreate = vi.fn();
const mockDelete = vi.fn();

beforeEach(() => {
  vi.mocked(hooks.useNutritionLogs).mockReturnValue({
    data: mockLogs,
    isLoading: false,
  } as any);
  vi.mocked(hooks.useCreateNutritionLog).mockReturnValue({
    mutate: mockCreate,
    isPending: false,
  } as any);
  vi.mocked(hooks.useDeleteNutritionLog).mockReturnValue({
    mutate: mockDelete,
  } as any);
});

afterEach(() => vi.clearAllMocks());

describe("NutritionPage", () => {
  it("renders all entries", () => {
    render(<RouteComponent />);
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(3);
  });

  it("groups two same-day entries under one date header showing their total", () => {
    render(<RouteComponent />);
    // Jun 9: 500 + 300 = 800 — unique value that only appears as the header total
    expect(screen.getByText("800 kcal")).toBeInTheDocument();
    // Jun 8: 700 — appears in both the header total and the single entry
    expect(screen.getAllByText("700 kcal")).toHaveLength(2);
  });

  it("shows label on an entry", () => {
    render(<RouteComponent />);
    expect(screen.getByText("Lunch")).toBeInTheDocument();
  });

  it("shows a category badge on an entry", () => {
    render(<RouteComponent />);
    expect(screen.getByText("meat")).toBeInTheDocument();
  });

  it("toggles the form when Log Nutrition is clicked", async () => {
    const user = userEvent.setup();
    render(<RouteComponent />);
    expect(screen.queryByLabelText(/calories/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log nutrition/i }));
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByLabelText(/calories/i)).not.toBeInTheDocument();
  });

  it("submits the form with label, category, and calories", async () => {
    const user = userEvent.setup();
    render(<RouteComponent />);
    await user.click(screen.getByRole("button", { name: /log nutrition/i }));

    await user.type(screen.getByPlaceholderText(/breakfast, lunch, snack/i), "Dinner");
    await user.selectOptions(screen.getByLabelText(/category/i), "fish");
    await user.type(screen.getByLabelText(/calories/i), "900");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Dinner", category: "fish", calories: 900 }),
      expect.any(Object)
    );
  });

  it("calls delete with the correct entry id", async () => {
    const user = userEvent.setup();
    render(<RouteComponent />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("shows a loading state", () => {
    vi.mocked(hooks.useNutritionLogs).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);
    render(<RouteComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
