export const setAccessToken = (token: string) => {
  sessionStorage.setItem("finsy_acessToken", token);
};

export const getAccessToken = (): string | null => {
  return sessionStorage.getItem("finsy_acessToken");
};

export const removeAccessToken = () => {
  sessionStorage.removeItem("finsy_acessToken");
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem("finsy_refreshToken", token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("finsy_refreshToken");
};

export const removeRefreshToken = () => {
  localStorage.removeItem("finsy_refreshToken");
};
