import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type UpdateWorkoutInput = {
  id: string;
  name?: string;
  description?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  estimatedDurationMinutes?: number;
  isPublic?: boolean;
};

export function useUpdateWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: UpdateWorkoutInput) => {
      const response = await axios.put(`/api/workouts/${id}`, body);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["list-all-workouts"] });
      queryClient.invalidateQueries({ queryKey: ["find-workout", id] });
    },
  });
}
