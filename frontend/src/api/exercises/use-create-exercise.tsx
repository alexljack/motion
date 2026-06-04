import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type CreateExerciseInput = {
  name: string;
  category: string;
  difficulty: string;
  mainTargetMuscle: string;
  description?: string;
  muscleGroups?: string[];
  equipmentNeeded?: string[];
  instructions?: string;
  isCompound?: boolean;
  duration?: number;
};

export function useCreateExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateExerciseInput) => {
      const response = await axios.post("/api/exercises", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-all-exercises"] });
    },
  });
}
