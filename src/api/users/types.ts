export interface User {
  id: string;
  isBot: boolean;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: string;
  addedToAttachMenu?: string;
  apiKey: string;
  role: Role;
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export interface ApiUser {
  id: string;
  is_bot: boolean;
  first_name: string;
  last_name: string | null;
  username: string | null;
  language_code: string | null;
  is_premium: boolean | null;
  added_to_attach_menu: boolean;
  apiKey: string;
  role: Role;
}
