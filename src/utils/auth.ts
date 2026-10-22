type MemoryStore = {
  get: () => string | null;
  set: (token: string | null) => void;
};
// The browser provider owns the token in React state/ref. No token lives in
// this module, and server rendering can never bind a user's session here.
let memoryStore: MemoryStore | null = null;
export function bindAccessTokenStore(store: MemoryStore) {
  if (typeof window === "undefined")
    throw new Error("Session store is browser-only");
  memoryStore = store;
  return () => {
    if (memoryStore === store) memoryStore = null;
  };
}
export const setAccessToken = (token: string) => memoryStore?.set(token);
export const getAccessToken = (): string | null =>
  typeof window === "undefined" ? null : (memoryStore?.get() ?? null);
export const removeAccessToken = () => memoryStore?.set(null);

export const removeRefreshToken = () => {
  // One-time cleanup for installations upgraded from the old storage strategy.
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("finsy_refreshToken");
  } catch {
    /* Legacy local storage may be blocked independently. */
  }
  try {
    sessionStorage.removeItem("finsy_acessToken");
  } catch {
    /* Storage may be disabled; the app does not require it. */
  }
};
