import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import {
  useBodyMeasurements,
  useCreateBodyMeasurement,
  useDeleteBodyMeasurement,
  useMeasurementTrends,
  type BodyMeasurement,
} from "./use-body-measurements";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockMeasurements: BodyMeasurement[] = [
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
];

const mockTrends = {
  measurementType: "weight",
  period: "3m",
  data: [
    { date: "2026-04-01T00:00:00.000Z", value: 182, change: 0, changePercent: 0 },
    { date: "2026-05-01T00:00:00.000Z", value: 181, change: -1, changePercent: -0.55 },
    { date: "2026-06-01T00:00:00.000Z", value: 180, change: -1, changePercent: -0.55 },
  ],
  summary: {
    latest: 180,
    earliest: 182,
    totalChange: -2,
    totalChangePercent: -1.1,
    dataPoints: 3,
  },
};

describe("useBodyMeasurements", () => {
  it("fetches measurements and returns them", async () => {
    server.use(
      http.get("/api/body-measurements", () => HttpResponse.json(mockMeasurements))
    );
    const { result } = renderHook(
      () => useBodyMeasurements({ measurementType: "weight" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0].value).toBe(180);
  });

  it("passes query params to the API", async () => {
    let capturedUrl = "";
    server.use(
      http.get("/api/body-measurements", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );
    const { result } = renderHook(
      () => useBodyMeasurements({ measurementType: "weight", limit: 20 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(capturedUrl).toContain("measurementType=weight");
    expect(capturedUrl).toContain("limit=20");
  });
});

describe("useCreateBodyMeasurement", () => {
  it("POSTs a measurement and returns it", async () => {
    server.use(
      http.post("/api/body-measurements", () =>
        HttpResponse.json({ ...mockMeasurements[0], _id: "99" }, { status: 201 })
      )
    );
    const { result } = renderHook(() => useCreateBodyMeasurement(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ measurementType: "weight", value: 180, unit: "lbs" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?._id).toBe("99");
  });

  it("sends the full payload including optional fields", async () => {
    let body: Partial<BodyMeasurement> | undefined;
    server.use(
      http.post("/api/body-measurements", async ({ request }) => {
        body = await request.json() as Partial<BodyMeasurement>;
        return HttpResponse.json(
          { ...body, _id: "99", user: "u1", createdAt: "", updatedAt: "" },
          { status: 201 }
        );
      })
    );
    const { result } = renderHook(() => useCreateBodyMeasurement(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      measurementType: "weight",
      value: 178.5,
      unit: "kg",
      timeOfDay: "morning",
      conditions: "fasted",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(body?.measurementType).toBe("weight");
    expect(body?.unit).toBe("kg");
    expect(body?.timeOfDay).toBe("morning");
    expect(body?.conditions).toBe("fasted");
  });
});

describe("useDeleteBodyMeasurement", () => {
  it("sends a DELETE request for the given id", async () => {
    let deletedId = "";
    server.use(
      http.delete("/api/body-measurements/:id", ({ params }) => {
        deletedId = params.id as string;
        return HttpResponse.json({ message: "Measurement deleted successfully" });
      })
    );
    const { result } = renderHook(() => useDeleteBodyMeasurement(), {
      wrapper: createWrapper(),
    });
    result.current.mutate("42");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deletedId).toBe("42");
  });
});

describe("useMeasurementTrends", () => {
  it("fetches trend data for a measurement type and period", async () => {
    server.use(
      http.get("/api/body-measurements/trends/:measurementType", () =>
        HttpResponse.json(mockTrends)
      )
    );
    const { result } = renderHook(() => useMeasurementTrends("weight", "3m"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(3);
    expect(result.current.data?.summary.latest).toBe(180);
  });

  it("is disabled when measurementType is empty", () => {
    const { result } = renderHook(() => useMeasurementTrends(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });
});
