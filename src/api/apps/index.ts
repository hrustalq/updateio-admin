import { PaginationParams } from "..";
import { CreateAppRequestParams } from "./create-app";
import { UpdateAppRequestParams } from "./update-app";

export * from "./types";
export * from "./create-app";
export * from "./get-apps";

export default {
  async getApps(pagination: PaginationParams) {
    return await import("./get-apps").then((mod) => mod.default(pagination));
  },
  async createApp(data: CreateAppRequestParams) {
    return await import("./create-app").then((mod) => mod.default(data));
  },
  async updateApp(id: string, data: UpdateAppRequestParams) {
    return await import("./update-app").then((mod) => mod.default(id, data));
  },
  async deleteApp(id: string) {
    return await import("./delete-app").then((mod) => mod.default(id));
  },
};
