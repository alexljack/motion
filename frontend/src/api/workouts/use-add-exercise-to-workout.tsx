import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type AddExerciseInput = {
  workoutId: string;
  exerciseId: string;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetDurationSeconds?: number;
  restSeconds?: number;
  notes?: string;
};

export function useAddExerciseToWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ workoutId, ...body }: AddExerciseInput) => {
      const response = await axios.post(`/api/workouts/${workoutId}/exercises`, body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-workouts"] });
    },
  });
}
