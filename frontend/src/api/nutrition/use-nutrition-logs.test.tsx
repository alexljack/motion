import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import {
  useNutritionLogs,
  useCreateNutritionLog,
  useDeleteNutritionLog,
  type CreateNutritionLog,
} from "./use-nutrition-logs";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

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
];

describe("useNutritionLogs", () => {
  it("fetches and returns logs", async () => {
    server.use(http.get("/api/nutrition-logs", () => HttpResponse.json(mockLogs)));
    const { result } = renderHook(() => useNutritionLogs(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.[0]._id).toBe("1");
  });

  it("passes query params to the API", async () => {
    let capturedUrl = "";
    server.use(
      http.get("/api/nutrition-logs", ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json([]);
      })
    );
    const { result } = renderHook(
      () => useNutritionLogs({ startDate: "2026-06-01", limit: 10 }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(capturedUrl).toContain("startDate=2026-06-01");
    expect(capturedUrl).toContain("limit=10");
  });
});

describe("useCreateNutritionLog", () => {
  it("POSTs a new log and returns it", async () => {
    server.use(
      http.post("/api/nutrition-logs", () =>
        HttpResponse.json({ ...mockLogs[0], _id: "99" }, { status: 201 })
      )
    );
    const { result } = renderHook(() => useCreateNutritionLog(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      date: "2026-06-09",
      calories: 500,
      protein: 30,
      carbs: 50,
      fat: 20,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?._id).toBe("99");
  });

  it("includes label and category in the request body", async () => {
    let body: CreateNutritionLog | undefined;
    server.use(
      http.post("/api/nutrition-logs", async ({ request }) => {
        body = await request.json() as CreateNutritionLog;
        return HttpResponse.json(
          { ...body, _id: "99", user: "u1", createdAt: "", updatedAt: "" },
          { status: 201 }
        );
      })
    );
    const { result } = renderHook(() => useCreateNutritionLog(), {
      wrapper: createWrapper(),
    });
    result.current.mutate({
      date: "2026-06-09",
      calories: 600,
      protein: 40,
      carbs: 60,
      fat: 20,
      label: "Breakfast",
      category: "eggs",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(body!.label).toBe("Breakfast");
    expect(body!.category).toBe("eggs");
  });
});

describe("useDeleteNutritionLog", () => {
  it("sends a DELETE request for the given id", async () => {
    let deletedId = "";
    server.use(
      http.delete("/api/nutrition-logs/:id", ({ params }) => {
        deletedId = params.id as string;
        return HttpResponse.json({ message: "Nutrition log deleted" });
      })
    );
    const { result } = renderHook(() => useDeleteNutritionLog(), {
      wrapper: createWrapper(),
    });
    result.current.mutate("42");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deletedId).toBe("42");
  });
});
