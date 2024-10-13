import apiClient from "../../instance";

export default async function deletePatchNote(id: string): Promise<void> {
  await apiClient.delete(`/patch-notes/${id}`);
}
