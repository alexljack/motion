import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useApproveExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.put(`/api/exercises/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-exercises"] });
      queryClient.invalidateQueries({ queryKey: ["list-all-exercises"] });
    },
  });
}
