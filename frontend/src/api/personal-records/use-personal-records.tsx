import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PersonalRecord } from "../workout-types";

// Get user's personal records
export const usePersonalRecords = (params?: {
  exercise?: string;
  recordType?: string;
}) => {
  return useQuery({
    queryKey: ["personal-records", params],
    queryFn: async () => {
      const response = await axios.get("/api/personal-records", { params });
      return response.data as PersonalRecord[];
    },
  });
};

// Get personal records for specific exercise
export const useExercisePersonalRecords = (exerciseId: string) => {
  return useQuery({
    queryKey: ["personal-records", "exercise", exerciseId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/personal-records/exercise/${exerciseId}`
      );
      return response.data as PersonalRecord[];
    },
    enabled: !!exerciseId,
  });
};

// Get heaviest lift PRs for main compound exercises
export const useMainLifts = () => {
  return useQuery({
    queryKey: ["personal-records", "main-lifts"],
    queryFn: async () => {
      const response = await axios.get("/api/personal-records/main-lifts");
      return response.data as { key: string; label: string; weight: number | null }[];
    },
  });
};

// Get recent personal records
export const useRecentPersonalRecords = (limit: number = 10) => {
  return useQuery({
    queryKey: ["personal-records", "recent", limit],
    queryFn: async () => {
      const response = await axios.get("/api/personal-records/recent", {
        params: { limit },
      });
      return response.data as PersonalRecord[];
    },
  });
};
