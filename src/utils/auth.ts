export const setAccessToken = (token: string) => {
  sessionStorage.setItem("finsy_acessToken", token);
};

export const getAccessToken = (): string | null => {
  return sessionStorage.getItem("finsy_acessToken");
};

export const removeAccessToken = () => {
  sessionStorage.removeItem("finsy_acessToken");
};
