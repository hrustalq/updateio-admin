import type { PaginationParams } from "@/api";
import apiClient from "../../instance";
import { GetAppsResponse } from "./types";

export * from "./types";
export default async function getApps(
  pagination: PaginationParams,
): Promise<GetAppsResponse> {
  const response = await apiClient.get<GetAppsResponse>("/apps", {
    params: pagination,
  });
  return response.data;
}
