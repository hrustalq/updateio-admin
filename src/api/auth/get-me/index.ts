import apiClient from "../../instance";

export default async function getMe() {
  const response = await apiClient.get("/auth/me");
  return response.data;
}
