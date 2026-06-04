import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/workouts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-workouts"] });
      queryClient.invalidateQueries({ queryKey: ["list-all-workouts"] });
    },
  });
}
