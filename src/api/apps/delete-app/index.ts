import apiClient from "../../instance";

export default async function deleteApp(id: string): Promise<void> {
  await apiClient.delete(`/apps/${id}`);
}
