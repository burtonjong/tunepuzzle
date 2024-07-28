"use client";

import { useContext } from "react";
import { type ReactNode, createContext } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  redirectToAuthCodeFlow,
  getAccessToken,
  fetchProfile,
} from "@/util/loginFlow";

import { CLIENT_ID } from "@/pages/api/secret";

interface Props {
  children: ReactNode | ReactNode[];
}

interface TUserReturn {
  data: UserProfile | undefined;
  isFetching: boolean;
}

export const UserContext = createContext<TUserReturn>({} as TUserReturn);

export function UserContextProvider({ children }: Props) {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    initialData: {} as UserProfile,
    queryKey: ["User"],
    queryFn: async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        console.log("user is not logged in");
        return {} as UserProfile;
      } else {
        const accessToken = await getAccessToken(CLIENT_ID, code);
        const profile = await fetchProfile(accessToken);
        return profile;
      }
    },
  });

  return (
    <UserContext.Provider
      value={{
        data,
        isFetching,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): TUserReturn {
  return useContext(UserContext);
}
