import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { Preferences } from "../types/settings";

type UpdatePreferencesPayload = Partial<Preferences>;

const useUpdateUserPreferences = (
  options?: UseMutationOptions<Preferences, Error, UpdatePreferencesPayload, unknown>
) => {
  const queryClient = useQueryClient();

  return useMutation<Preferences, Error, UpdatePreferencesPayload, unknown>({
    mutationFn: async (data: UpdatePreferencesPayload) => {
      const response = await axios.patch("/api/users/preferences", data);
      return response.data as Preferences;
    },
    ...options,
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      options?.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export default useUpdateUserPreferences;
