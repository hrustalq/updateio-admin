import type { PaginationParams } from "@/api";
import apiClient from "../../instance";
import { GetPatchNotesResponse } from "./types";

export * from "./types";
export default async function getPatchNotes(
  pagination: PaginationParams,
): Promise<GetPatchNotesResponse> {
  const response = await apiClient.get<GetPatchNotesResponse>("/patch-notes", {
    params: pagination,
  });
  return response.data;
}
