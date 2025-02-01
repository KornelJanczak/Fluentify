import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { authService } from "./auth.service";
import { Messages } from "@/components/chat/messages";
import { Chat } from "@/components/chat";

export const getUserKey = ["users", "me"];

export const useLogout = () => {
  const logoutQuery = useQuery({
    queryKey: getUserKey,
    queryFn: async () => await authService.logOut(),
  });

  return {
    ...logoutQuery,
  };
};

type UseUserReturn = UseQueryResult<UserResponse, unknown> & {
  user: UserResponse | undefined;
};

type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type UserResponse = User | null;
