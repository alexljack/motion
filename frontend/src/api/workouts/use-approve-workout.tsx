import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useApproveWorkout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(`/api/workouts/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-workouts"] });
      queryClient.invalidateQueries({ queryKey: ["list-all-workouts"] });
    },
  });
}
