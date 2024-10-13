import type { UpdatePatchNoteRequestParams } from "./types";
import apiClient from "../../instance";
import { PatchNote } from "../types";

export * from "./types";

export default async function updatePatchNote(
  id: string,
  params: UpdatePatchNoteRequestParams,
): Promise<PatchNote> {
  const response = await apiClient.patch<PatchNote>(
    `/patch-notes/${id}`,
    params,
  );
  return response.data;
}
