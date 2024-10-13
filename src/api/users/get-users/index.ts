import { PaginationParams } from "@/api/types";
import { GetUsersResponse, ApiGetUsersResponse } from "./types";
import apiClient from "@/api/instance";
import { adaptApiUserToUser } from "../adapters";

export * from "./types";
export default async function getUsers(
  params: PaginationParams,
): Promise<GetUsersResponse> {
  const response = await apiClient.get<ApiGetUsersResponse>("/users", {
    params,
  });
  return {
    ...response.data,
    data: response.data.data.map(adaptApiUserToUser),
  };
}
