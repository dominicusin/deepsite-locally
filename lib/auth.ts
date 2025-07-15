import { User } from "@/types";
import { NextResponse } from "next/server";

// UserResponse = type User & { token: string };
type UserResponse = User & { token: string };

export const isAuthenticated = async (): Promise<UserResponse | NextResponse<unknown> | undefined> => {
  // Mock user for now, as Hugging Face authentication is removed
  const user: User = {
    id: "mock-user-id",
    name: "Mock User",
    fullname: "Mock User",
    avatarUrl: "https://www.gravatar.com/avatar/?d=mp",
    isPro: false,
    isLocalUse: true,
  };

  return {
    ...user,
    token: "mock-token",
  };
};