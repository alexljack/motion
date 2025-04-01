import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useListWorkouts() {
  return useQuery({
    queryKey: ["list-all-workouts"],
    queryFn: async () => {
      // const response = await axios.get("/api/exercises");
      const response = await axios.get("/api/workouts");
      return response.data;
    },
  });
}

export default useListWorkouts;
