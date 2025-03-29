import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Exercise } from "./use-list-exercises";

const useFindExercise = (id: string) => {
  return useQuery<Exercise>({
    queryKey: ["find-exercise", id],
    queryFn: async () => {
      const response = await axios.get(`/api/exercises/${id}`);
      return response.data;
    },
  });
};

export default useFindExercise;
