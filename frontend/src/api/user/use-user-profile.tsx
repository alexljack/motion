import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

type UserData = {
  email: string;
  first_name: string;
  isAdmin: boolean;
  last_name: string;
  _id: string;
};

type UserUserProfileOptions = Omit<
  UseQueryOptions<UserData, Error, UserData>,
  "queryKey" | "queryFn"
>;

function useUserProfile(options?: UserUserProfileOptions) {
  return useQuery<UserData>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await axios.get("/api/users/profile");
      return response.data;
    },
    ...options,
  });
}

export default useUserProfile;
export type { UserData };
