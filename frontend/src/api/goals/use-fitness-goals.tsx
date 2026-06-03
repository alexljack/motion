import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface FitnessGoal {
  _id: string;
  user: string;
  title: string;
  description?: string;
  goalType: string;
  targetValue?: number;
  targetUnit?: string;
  currentValue: number;
  exercise?: {
    _id: string;
    name: string;
    category: string;
    mainTargetMuscle: string;
  };
  targetDate?: string;
  startDate: string;
  completedDate?: string;
  status: "active" | "completed" | "paused" | "abandoned";
  progress: number;
  priority: "low" | "medium" | "high" | "critical";
  reward?: string;
  milestones: Array<{
    _id: string;
    description: string;
    targetValue?: number;
    achievedDate?: string;
    achieved: boolean;
  }>;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Get fitness goals
export const useFitnessGoals = (params?: {
  status?: string;
  goalType?: string;
}) => {
  return useQuery({
    queryKey: ["fitness-goals", params],
    queryFn: async () => {
      const response = await axios.get("/api/fitness-goals", { params });
      return response.data as FitnessGoal[];
    },
  });
};

// Get single fitness goal
export const useFitnessGoal = (id: string) => {
  return useQuery({
    queryKey: ["fitness-goal", id],
    queryFn: async () => {
      const response = await axios.get(`/api/fitness-goals/${id}`);
      return response.data as FitnessGoal;
    },
    enabled: !!id,
  });
};

// Create fitness goal
export const useCreateFitnessGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<FitnessGoal>) => {
      const response = await axios.post("/api/fitness-goals", data);
      return response.data as FitnessGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fitness-goals"] });
    },
  });
};

// Update fitness goal
export const useUpdateFitnessGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<FitnessGoal>;
    }) => {
      const response = await axios.put(`/api/fitness-goals/${id}`, data);
      return response.data as FitnessGoal;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["fitness-goal", id] });
      queryClient.invalidateQueries({ queryKey: ["fitness-goals"] });
    },
  });
};
