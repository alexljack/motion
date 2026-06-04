import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Workout } from "./use-list-workouts";

type CreateWorkoutInput = {
  name: string;
  description?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  estimatedDurationMinutes?: number;
  isPublic?: boolean;
};

export function useCreateWorkout() {
  const queryClient = useQueryClient();
  return useMutation<Workout, Error, CreateWorkoutInput>({
    mutationFn: async (data) => {
      const response = await axios.post("/api/workouts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-workouts"] });
    },
  });
}
