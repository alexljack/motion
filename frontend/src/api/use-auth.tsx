import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useAuth = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/users/auth", data);
      return response.data;
    },
  });
};

export default useAuth;
