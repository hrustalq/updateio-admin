import type { PaginationParams } from "@/api";
import apiClient from "../../instance";
import { GetGamesResponse } from "./types";

export * from "./types";
export default async function getGames(
  pagination: PaginationParams & { appId?: string | null },
): Promise<GetGamesResponse> {
  const response = await apiClient.get<GetGamesResponse>("/games", {
    params: pagination,
  });
  return response.data;
}
