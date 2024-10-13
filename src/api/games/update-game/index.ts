import type { UpdateGameRequestParams, UpdateGameResponse } from "./types";
import apiClient from "../../instance";

export * from "./types";

export default async function updateGame(
  id: string,
  params: UpdateGameRequestParams,
): Promise<UpdateGameResponse> {
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

  const response = await apiClient.patch<UpdateGameResponse>(
    `/games/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
