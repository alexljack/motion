import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type RemoveExerciseInput = {
  workoutId: string;
  templateExerciseId: string;
};

export function useRemoveExerciseFromWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workoutId, templateExerciseId }: RemoveExerciseInput) => {
      const response = await axios.delete(
        `/api/workouts/${workoutId}/exercises/${templateExerciseId}`
      );
      return response.data;
    },
    onSuccess: (_, { workoutId }) => {
      queryClient.invalidateQueries({ queryKey: ["find-workout", workoutId] });
      queryClient.invalidateQueries({ queryKey: ["list-all-workouts"] });
    },
  });
}
