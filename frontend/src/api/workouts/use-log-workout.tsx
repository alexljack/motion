import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

const useLogWorkout = (options: UseMutationOptions) => {
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
