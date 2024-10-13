export interface UpdateGameRequestParams {
  name: string;
  appIds: string[];
  version?: string;
  image?: File;
}

export interface UpdateGameResponse {
  id: string;
  name: string;
  version?: string;
  appIds: string[];
  appNames: string[];
  imageUrl?: string;
}
