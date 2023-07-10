export const AsyncLocalStorage = {
  setItem: async function (k, v) {
    await null;
    return localStorage.setItem(k, v)
  },
  getItem: async function (k) {
    await null;
    return localStorage.getItem(k)
  }
}