export interface CreatePatchNoteRequestParams {
  title: string;
  content: string;
  version?: string;
  releaseDate: Date;
  gameId: string;
}
