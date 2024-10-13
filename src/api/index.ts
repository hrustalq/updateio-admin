export * from "./types";
export { default as authApi } from "./auth";
export { default as usersApi } from "./users";
export { default as gamesApi } from "./games";
export { default as appsApi } from "./apps";
export { default as patchNotesApi } from "./patch-notes";

import usersApi from "./users";

export const api = {
  // ... existing APIs
  users: usersApi,
};
