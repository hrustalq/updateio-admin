import Cookies from "js-cookie";

console.log(Cookies.get("RefreshToken"));
console.log(Cookies.get("AccessToken"));
console.log(window);

export function clearCookies() {
  Cookies.remove("AccessToken");
  Cookies.remove("RefreshToken");
}

export function setAccessToken(token: string) {
  Cookies.set("AccessToken", token);
}

export function setRefreshToken(token: string) {
  Cookies.set("RefreshToken", token);
}

export function getAccessToken() {
  return Cookies.get("AccessToken");
}

export function getRefreshToken() {
  return Cookies.get("RefreshToken");
}

export const getCSRFToken = () => {
  return Cookies.get("XSRF-TOKEN");
};
