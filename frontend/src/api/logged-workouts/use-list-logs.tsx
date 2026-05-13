import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalWorkouts: number;
};

type Set = {
  completed: boolean;
  distance: number;
  durationInSeconds: number;
  reps: number;
  restTime: number;
  setNumber: number;
  weight: number;
  _id: string;
};

type SessionExercise = {
  exercise: {
    _id: string;
    name: string;
    category: string;
    mainTargetMuscle: string;
  };
  maxWeight: number;
  sets: Set[];
  totalReps: number;
  totalSets: number;
};

type WorkoutSession = {
  avgRpe: number;
  completedAt: string;
  createdAt: string;
  duration: number;
  exercises: SessionExercise[];
  feeling: string;
  name: string;
  rating: number;
  startedAt: string;
  status: string;
  tags: string[];
  totalReps: number;
  totalSets: number;
  totalWeight: number;
  updatedAt: string;
  user: string;
  _id: string;
  __v: number;
};

type Log = {
  workoutSessions: WorkoutSession[];
  pagination: Pagination;
};

function useListLogs() {
  return useQuery<Log>({
    queryKey: ["list-logs"],
    queryFn: async () => {
      const response = await axios.get("/api/workout-sessions");
      return response.data;
    },
  });
}

export default useListLogs;
export type { WorkoutSession };
