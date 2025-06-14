// frontend/src/api/workout-sessions/use-workout-sessions.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { WorkoutSession, WorkoutStats } from "../workout-types";

// Get user's workout sessions
export const useWorkoutSessions = (params?: {
  status?: string;
  limit?: number;
  page?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ["workout-sessions", params],
    queryFn: async () => {
      const response = await axios.get("/api/workout-sessions", { params });
      return response.data;
    },
  });
};

// Get single workout session
export const useWorkoutSession = (id: string) => {
  return useQuery({
    queryKey: ["workout-session", id],
    queryFn: async () => {
      const response = await axios.get(`/api/workout-sessions/${id}`);
      return response.data as WorkoutSession;
    },
    enabled: !!id,
  });
};

// Create workout session
export const useCreateWorkoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      basedOnWorkout?: string;
      exercises?: unknown[];
    }) => {
      const response = await axios.post("/api/workout-sessions", data);
      return response.data as WorkoutSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });
    },
  });
};

// Start workout session
export const useStartWorkoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(`/api/workout-sessions/${id}/start`);
      return response.data as WorkoutSession;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["workout-session", id] });
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });
    },
  });
};

// Complete workout session
export const useCompleteWorkoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      rating,
      feeling,
      notes,
    }: {
      id: string;
      rating?: number;
      feeling?: string;
      notes?: string;
    }) => {
      const response = await axios.put(`/api/workout-sessions/${id}/complete`, {
        rating,
        feeling,
        notes,
      });
      return response.data as WorkoutSession;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["workout-session", id] });
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["personal-records"] });
    },
  });
};

// Update exercise set
export const useUpdateExerciseSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      exerciseIndex,
      setData,
    }: {
      sessionId: string;
      exerciseIndex: number;
      setData: unknown;
    }) => {
      const response = await axios.put(
        `/api/workout-sessions/${sessionId}/exercises/${exerciseIndex}/sets`,
        { setData }
      );
      return response.data as WorkoutSession;
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["workout-session", sessionId],
      });
    },
  });
};

// Delete workout session
export const useDeleteWorkoutSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/workout-sessions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });
    },
  });
};

// Get workout statistics
export const useWorkoutStats = (period: string = "30d") => {
  return useQuery({
    queryKey: ["workout-stats", period],
    queryFn: async () => {
      const response = await axios.get("/api/workout-sessions/stats", {
        params: { period },
      });
      return response.data as WorkoutStats;
    },
  });
};
