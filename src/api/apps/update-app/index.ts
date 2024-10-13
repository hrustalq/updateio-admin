import type { UpdateAppRequestParams, UpdateAppResponse } from "./types";
import apiClient from "../../instance";

export * from "./types";

export default async function updateApp(
  id: string,
  params: UpdateAppRequestParams,
): Promise<UpdateAppResponse> {
  const formData = new FormData();
  formData.append("name", params.name);

  if (params.image instanceof File) {
    formData.append("image", params.image);
  }

  const response = await apiClient.patch<UpdateAppResponse>(
    `/apps/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}
