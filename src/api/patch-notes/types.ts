export interface PatchNote {
  id: string;
  title: string;
  content: string;
  version: string | null;
  releaseDate: string;
  gameId: string;
  createdAt: string;
  updatedAt: string;
}
