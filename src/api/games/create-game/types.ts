export interface CreateGameRequestParams {
  name: string;
  appIds: string[];
  version?: string;
  image?: File;
}

export interface CreateGameResponse {
  id: string;
  name: string;
  version?: string;
  appIds: string[];
  appNames: string[];
  imageUrl?: string;
}
