import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { WorkoutSession } from "../workout-types";

export type WorkoutSessionInput = {
  name: string;
  workoutTemplate?: string;
  exercises?: unknown[];
};

const useLogWorkout = (
  options?: UseMutationOptions<
    WorkoutSession,
    Error,
    WorkoutSessionInput,
    unknown
  >
) => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/api/workout-sessions", formData);
      return res.data;
    },
    ...options,
  });
};

export default useLogWorkout;
