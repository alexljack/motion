import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Workout } from "./use-list-workouts";

const useFindWorkout = (id: string) => {
  return useQuery<Workout>({
    queryKey: ["find-workout", id],
    queryFn: async () => {
      const response = await axios.get(`/api/workouts/${id}`);
      return response.data;
    },

    enabled: !!id, // Only run the query if id is truthy
    refetchOnWindowFocus: false,
    // retry: false, // Optional: Prevent automatic retries on failure
    staleTime: 1000 * 60 * 5, // Optional: Set stale time to 5 minutes
    // cacheTime: 1000 * 60 * 10, // Optional: Set cache time to 10 minutes
  });
};

export default useFindWorkout;
