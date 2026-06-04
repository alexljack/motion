import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Workout } from "./use-list-workouts";

type PendingWorkout = Workout & {
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  isApproved: false;
};

export function usePendingWorkouts() {
  return useQuery<PendingWorkout[]>({
    queryKey: ["pending-workouts"],
    queryFn: async () => {
      const response = await axios.get("/api/workouts/pending");
      return response.data;
    },
  });
}

export type { PendingWorkout };
