import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type AuthResponse = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  isAdmin: boolean;
};

type AuthCredentials = {
  email: string;
  password: string;
};

const useAuth = () => {
  return useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (data: AuthCredentials) => {
      const response = await axios.post("/api/users/auth", data);
      return response.data;
    },
  });
};

export default useAuth;
