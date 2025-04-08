import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Workout = {
  _id: string;
  name: string;
  description: string;
  duration: number;
  exercises: string[];
};

function useListWorkouts() {
  return useQuery<Workout[]>({
    queryKey: ["list-all-workouts"],
    queryFn: async () => {
      const response = await axios.get("/api/workouts");
      return response.data;
    },
  });
}

export default useListWorkouts;
export type { Workout };
