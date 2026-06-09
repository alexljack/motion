import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import * as hooks from "../../api/body-measurements/use-body-measurements";
import { RouteComponent } from "./index";

vi.mock("../../api/body-measurements/use-body-measurements");

const mockEntries = [
  {
    _id: "1",
    user: "u1",
    measurementType: "weight",
    value: 180,
    unit: "lbs",
    measuredDate: "2026-06-09T08:00:00.000Z",
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "2",
    user: "u1",
    measurementType: "weight",
    value: 179.5,
    unit: "lbs",
    measuredDate: "2026-06-08T08:00:00.000Z",
    change: -0.5,
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "3",
    user: "u1",
    measurementType: "weight",
    value: 181,
    unit: "lbs",
    measuredDate: "2026-06-07T08:00:00.000Z",
    change: 1.5,
    createdAt: "",
    updatedAt: "",
  },
];

const mockTrends = {
  measurementType: "weight",
  period: "3m",
  data: [
    { date: "2026-04-01T00:00:00.000Z", value: 182, change: 0, changePercent: 0 },
    { date: "2026-06-09T00:00:00.000Z", value: 180, change: -2, changePercent: -1.1 },
  ],
  summary: {
    latest: 180,
    earliest: 182,
    totalChange: -2,
    totalChangePercent: -1.1,
    dataPoints: 2,
  },
};

const mockCreate = vi.fn();
const mockDelete = vi.fn();

beforeEach(() => {
  vi.mocked(hooks.useBodyMeasurements).mockReturnValue({
    data: mockEntries,
    isLoading: false,
  } as unknown as ReturnType<typeof hooks.useBodyMeasurements>);
  vi.mocked(hooks.useCreateBodyMeasurement).mockReturnValue({
    mutate: mockCreate,
    isPending: false,
  } as unknown as ReturnType<typeof hooks.useCreateBodyMeasurement>);
  vi.mocked(hooks.useDeleteBodyMeasurement).mockReturnValue({
    mutate: mockDelete,
  } as unknown as ReturnType<typeof hooks.useDeleteBodyMeasurement>);
  vi.mocked(hooks.useMeasurementTrends).mockReturnValue({
    data: mockTrends,
  } as unknown as ReturnType<typeof hooks.useMeasurementTrends>);
});

afterEach(() => vi.clearAllMocks());

describe("WeightPage", () => {
  it("renders all entries", () => {
    render(<RouteComponent />);
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(3);
  });

  it("shows weight value and unit for each entry", () => {
    render(<RouteComponent />);
    expect(screen.getByText("179.5 lbs")).toBeInTheDocument();
    expect(screen.getByText("181 lbs")).toBeInTheDocument();
  });

  it("shows change with correct sign", () => {
    render(<RouteComponent />);
    expect(screen.getByText("-0.5")).toBeInTheDocument();
    expect(screen.getByText("+1.5")).toBeInTheDocument();
  });

  it("shows the chart and period buttons when trends has >= 2 data points", () => {
    render(<RouteComponent />);
    expect(screen.getByRole("button", { name: "1m" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3m" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "6m" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1y" })).toBeInTheDocument();
  });

  it("hides the chart when trends has fewer than 2 data points", () => {
    vi.mocked(hooks.useMeasurementTrends).mockReturnValue({
      data: { ...mockTrends, data: [mockTrends.data[0]] },
    } as unknown as ReturnType<typeof hooks.useMeasurementTrends>);
    render(<RouteComponent />);
    expect(screen.queryByRole("button", { name: "1m" })).not.toBeInTheDocument();
  });

  it("shows the total change in the chart summary", () => {
    render(<RouteComponent />);
    expect(screen.getByText("-2.0 total")).toBeInTheDocument();
  });

  it("toggles the form", async () => {
    const user = userEvent.setup();
    render(<RouteComponent />);
    expect(screen.queryByLabelText(/^weight$/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log weight/i }));
    expect(screen.getByLabelText(/^weight$/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByLabelText(/^weight$/i)).not.toBeInTheDocument();
  });

  it("submits with measurementType weight and the entered value", async () => {
    const user = userEvent.setup();
    render(<RouteComponent />);
    await user.click(screen.getByRole("button", { name: /log weight/i }));
    await user.type(screen.getByLabelText(/^weight$/i), "178");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ measurementType: "weight", value: 178 }),
      expect.any(Object)
    );
  });

  it("includes unit, timeOfDay, and conditions in the submission", async () => {
    const user = userEvent.setup();
    render(<RouteComponent />);
    await user.click(screen.getByRole("button", { name: /log weight/i }));
    await user.type(screen.getByLabelText(/^weight$/i), "80");
    await user.selectOptions(screen.getByLabelText(/^unit$/i), "kg");
    await user.selectOptions(screen.getByLabelText(/time of day/i), "morning");
    await user.type(screen.getByLabelText(/conditions/i), "fasted");
    await user.click(screen.getByRole("button", { name: /save/i }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ unit: "kg", timeOfDay: "morning", conditions: "fasted" }),
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
    vi.mocked(hooks.useBodyMeasurements).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof hooks.useBodyMeasurements>);
    render(<RouteComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
