export default {
  login: async (username: string, password: string) => {
    return await import("./login").then(({ default: login }) =>
      login(username, password),
    );
  },
  logout: async () => {
    return await import("./logout").then(({ default: logout }) => logout());
  },
  getMe: async () => {
    return await import("./get-me").then(({ default: getMe }) => getMe());
  },
};
