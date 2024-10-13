import apiClient from "../../instance";

export default async function login(
  username: string,
  password: string,
): Promise<void> {
  const response = await apiClient.post(
    "/auth/login",
    {
      username,
      password,
    },
    {
      withCredentials: true,
    },
  );
  return response.data;
}
