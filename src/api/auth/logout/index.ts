import { clearCookies } from "@/lib/auth";
import apiClient from "../../instance";

export default async function () {
  try {
    await apiClient.post("/auth/logout", {}, { withCredentials: true });

    clearCookies();

    return { success: true };
  } catch (error) {
    console.error("Logout failed", error);
    return { success: false, error };
  }
}
