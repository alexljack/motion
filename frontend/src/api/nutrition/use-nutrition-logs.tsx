import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface NutritionLog {
  _id: string;
  user: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateNutritionLog = Omit<NutritionLog, "_id" | "user" | "createdAt" | "updatedAt">;

export const useNutritionLogs = (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["nutrition-logs", params],
    queryFn: async () => {
      const response = await axios.get("/api/nutrition-logs", { params });
      return response.data as NutritionLog[];
    },
  });
};

export const useCreateNutritionLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNutritionLog) => {
      const response = await axios.post("/api/nutrition-logs", data);
      return response.data as NutritionLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition-logs"] });
    },
  });
};

export const useDeleteNutritionLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/nutrition-logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nutrition-logs"] });
    },
  });
};
