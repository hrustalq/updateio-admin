export interface CreateProviderRequestParams {
  name: string;
}

export interface CreateAppRequestParams {
  name: string;
  image?: File;
}

export interface CreateAppResponse {
  id: string;
  name: string;
  imageUrl?: string;
}
