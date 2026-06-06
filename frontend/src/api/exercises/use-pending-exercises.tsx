import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { Exercise } from "./use-list-exercises";

type PendingExercise = Exercise & {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  isApproved: false;
};

export function usePendingExercises(
  options?: Omit<UseQueryOptions<PendingExercise[]>, "queryFn" | "queryKey">,
) {
  return useQuery<PendingExercise[]>({
    queryKey: ["pending-exercises"],
    queryFn: async () => {
      const response = await axios.get("/api/exercises/pending");
      return response.data;
    },
    ...options,
  });
}

export type { PendingExercise };
