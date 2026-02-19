import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

type RegisterResponse = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  isAdmin: boolean;
  height: number;
  weight: number;
};

type RegisterCredentials = {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  weight: number;
  height: number;
};

const useRegister = (
  options?: UseMutationOptions<
    RegisterResponse,
    Error,
    RegisterCredentials,
    unknown
  >
) => {
  return useMutation<RegisterResponse, Error, RegisterCredentials, unknown>({
    mutationFn: async (data: RegisterCredentials) => {
      const response = await axios.post("/api/users", data);
      return response.data as RegisterResponse;
    },
    ...options,
  });
};

export default useRegister;
