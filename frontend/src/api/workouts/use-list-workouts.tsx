import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Exercise } from "../exercises/use-list-exercises";

export type TemplateExercise = {
  _id: string;
  exercise: Exercise;
  orderIndex: number;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetDurationSeconds?: number;
  restSeconds?: number;
  notes?: string;
};

type Workout = {
  _id: string;
  user: string;
  name: string;
  description?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  estimatedDurationMinutes?: number;
  isPublic: boolean;
  exercises: TemplateExercise[];
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
