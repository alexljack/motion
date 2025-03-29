import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

type LogoutResponse = {
  code: number;
  message: string;
};

const useLogout = (
  options?: UseMutationOptions<LogoutResponse, Error, void, unknown>
) => {
  return useMutation<LogoutResponse, Error, void, unknown>({
    mutationFn: async () => {
      const response = await axios.post("/api/users/logout");
      return response.data;
    },
    ...options,
  });
};

export default useLogout;
