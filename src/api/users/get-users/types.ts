import { PaginatedResponse } from "@/api/types";
import { User, ApiUser } from "../types";

export type GetUsersResponse = PaginatedResponse<User>;
export type ApiGetUsersResponse = PaginatedResponse<ApiUser>;
