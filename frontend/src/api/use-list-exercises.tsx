import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Exercise = {
  category: string;
  description: string;
  difficulty: string;
  duration: number;
  equipment: string;
  image: string;
  muscleGroup: string[];
  name: string;
  _id: string;
};

export const useListExercises = () => {
  return useQuery<Exercise[]>({
    queryKey: ["list-all-exercises"], // Pass the key as an array
    queryFn: async () => {
      // const response = await axios.get("http://localhost:3001/exercises");
      const response = await axios.get("/api/exercises");
      return response.data; // Ensure the function returns the data
    },
  });
};

export type { Exercise };
