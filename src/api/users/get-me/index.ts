import apiClient from "@/api/instance";
import { User, ApiUser } from "../types";
import { adaptApiUserToUser } from "../adapters";

export default async function getMe(): Promise<User> {
  const response = await apiClient.get<ApiUser>("/users/me");
  return adaptApiUserToUser(response.data);
}
