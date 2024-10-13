import { CreateUserData } from "./types";
import { User, ApiUser } from "../types";
import apiClient from "@/api/instance";
import { adaptApiUserToUser } from "../adapters";

export * from "./types";
export default async function createUser(data: CreateUserData): Promise<User> {
  const response = await apiClient.post<ApiUser>("/users", data);
  return adaptApiUserToUser(response.data);
}
