import type { CreateAppRequestParams, CreateAppResponse } from "./types";
import apiClient from "../../instance";

export * from "./types";

export default async function createApp(
  params: CreateAppRequestParams,
): Promise<CreateAppResponse> {
  const formData = new FormData();
  formData.append("name", params.name);

  if (params.image instanceof File) {
    formData.append("image", params.image);
  }

  const response = await apiClient.post<CreateAppResponse>("/apps", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
