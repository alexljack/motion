import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { UserData } from "./use-user-profile";

type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  height?: number;
  weight?: number;
};

const useUpdateUserProfile = (
  options?: UseMutationOptions<UserData, Error, UpdateProfilePayload, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation<UserData, Error, UpdateProfilePayload, unknown>({
    mutationFn: async (data: UpdateProfilePayload) => {
      const response = await axios.put("/api/users/profile", data);
      return response.data as UserData;
    },
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export default useUpdateUserProfile;
