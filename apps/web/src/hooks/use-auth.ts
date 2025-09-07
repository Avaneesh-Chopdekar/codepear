"use client";
import { useAtomValue } from "jotai";
import { userAtom } from "../atoms/user-atom";

// TODO: Later improve this by adding /auth/me endpoint

export default function useAuth() {
  const { token, user } = useAtomValue(userAtom);

  const isAuthenticated = !!token && !!user?.id;

  return { user, token, isAuthenticated };
}
