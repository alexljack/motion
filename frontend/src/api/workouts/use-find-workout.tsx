import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { Workout } from "./use-list-workouts";

type UseFindWorkoutOptions = Omit<
  UseQueryOptions<Workout, Error, Workout>,
  "queryKey" | "queryFn"
>;

const useFindWorkout = (id: string, options: UseFindWorkoutOptions) => {
  const { ...restOptions } = options || {};
  return useQuery<Workout, Error, Workout>({
    queryKey: ["find-workout", id],
    queryFn: async () => {
      const response = await axios.get(`/api/workouts/${id}`);
      return response.data;
    },
    ...restOptions,
  });
};

export default useFindWorkout;
