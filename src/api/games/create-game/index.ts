import type { CreateGameRequestParams, CreateGameResponse } from "./types";
import apiClient from "../../instance";

export * from "./types";

export default async function createGame(
  params: CreateGameRequestParams,
): Promise<CreateGameResponse> {
  const formData = new FormData();
  formData.append("name", params.name);
  params.appIds.forEach((appId) => {
    formData.append("appIds[]", appId);
  });
  if (params.version) {
    formData.append("version", params.version);
  }
  if (params.image instanceof File) {
    formData.append("image", params.image);
  }

  const response = await apiClient.post<CreateGameResponse>(
    "/games",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
