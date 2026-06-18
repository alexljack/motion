import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/workout-sessions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-logs"] });
    },
  });
}
