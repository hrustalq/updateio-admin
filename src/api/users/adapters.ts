import { User, ApiUser } from "./types";

export function adaptApiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    isBot: apiUser.is_bot,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name || undefined,
    username: apiUser.username || undefined,
    languageCode: apiUser.language_code || undefined,
    isPremium:
      apiUser.is_premium !== null ? String(apiUser.is_premium) : undefined,
    addedToAttachMenu: apiUser.added_to_attach_menu ? "true" : undefined,
    apiKey: apiUser.apiKey,
    role: apiUser.role,
  };
}
