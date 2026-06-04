import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteExercise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/exercises/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-exercises"] });
      queryClient.invalidateQueries({ queryKey: ["list-all-exercises"] });
    },
  });
}
