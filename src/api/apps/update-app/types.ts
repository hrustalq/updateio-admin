export interface UpdateAppRequestParams {
  name: string;
  image?: File;
}

export interface UpdateAppResponse {
  id: string;
  name: string;
  imageUrl?: string;
}
