import apiClient from "../../instance";

export default async function deleteGame(id: string): Promise<void> {
  await apiClient.delete(`/games/${id}`);
}
