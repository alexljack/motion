import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Exercise = {
  _id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  duration: number;
  difficulty: string;
  equipment: string;
  mainTargetMuscle: string;
  muscleGroup: string;
};

type Workout = {
  _id: string;
  name: string;
  description: string;
  duration: number;
  exercises: Exercise[];
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
