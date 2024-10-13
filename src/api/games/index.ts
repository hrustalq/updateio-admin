import { PaginationParams } from "..";
import { CreateGameRequestParams } from "./create-game";
import { UpdateGameRequestParams } from "./update-game";

export * from "./types";
export * from "./create-game";
export * from "./get-games";

export default {
  async getGames(pagination: PaginationParams & { appId?: string | null }) {
    return await import("./get-games").then((mod) => mod.default(pagination));
  },
  async createGame(data: CreateGameRequestParams) {
    return await import("./create-game").then((mod) => mod.default(data));
  },
  async updateGame(id: string, data: UpdateGameRequestParams) {
    return await import("./update-game").then((mod) => mod.default(id, data));
  },
  async deleteGame(id: string) {
    return await import("./delete-game").then((mod) => mod.default(id));
  },
};
