import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

export type ExerciseSet = {
  exercise: string; // exercise ID
  sets: number;
  reps: number;
  weight: number;
};

export type WorkoutLogInput = {
  workout?: string; // Optional workout ID
  exercises: ExerciseSet[];
  notes?: string;
};

export type WorkoutLogResponse = {
  _id: string;
  user: string;
  workout?: string;
  date: string;
  exercises: ExerciseSet[];
  notes?: string;
};

const useLogWorkout = (
  options?: UseMutationOptions<
    WorkoutLogResponse,
    Error,
    WorkoutLogInput,
    unknown
  >
) => {
  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/api/logs/", formData);
      return res.data;
    },
    ...options,
  });
};

export default useLogWorkout;

// const logWorkoutMutation = useMutation({
// mutationFn: async () => {
//     const response = await axios.post("/api/logs", {
//     id,
//     date,
//     exercises,
//     totalDuration,
//     notes,
//     rating,
//     feelingScore,
//     });
//     return response.data;
// },
// onSuccess: () => {
//     navigate({ to: "/logs" });
// },
// });
