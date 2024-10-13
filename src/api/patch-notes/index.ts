import { PaginationParams } from "..";
import { CreatePatchNoteRequestParams } from "./create-patch-note";
import { UpdatePatchNoteRequestParams } from "./update-patch-note";

export * from "./types";
export * from "./create-patch-note";
export * from "./get-patch-notes";
export * from "./update-patch-note";
export * from "./delete-patch-note";

export default {
  async getPatchNotes(pagination: PaginationParams) {
    return await import("./get-patch-notes").then((mod) =>
      mod.default(pagination),
    );
  },
  async createPatchNote(data: CreatePatchNoteRequestParams) {
    return await import("./create-patch-note").then((mod) => mod.default(data));
  },
  async updatePatchNote(id: string, data: UpdatePatchNoteRequestParams) {
    return await import("./update-patch-note").then((mod) =>
      mod.default(id, data),
    );
  },
  async deletePatchNote(id: string) {
    return await import("./delete-patch-note").then((mod) => mod.default(id));
  },
};
