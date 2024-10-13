import type { CreatePatchNoteRequestParams } from "./types";
import apiClient from "../../instance";

export * from "./types";

export default async function createPatchNote(
  params: CreatePatchNoteRequestParams,
) {
  const response = await apiClient.post("/patch-notes", params);
  return response.data;
}
