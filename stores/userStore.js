import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', () => {
  const token = ref(null);
  const user = ref(null);

  const setToken = (newToken) => {
    token.value = newToken;
  };

  const setUser = (newUser) => {
    user.value = newUser;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  return {
    token,
    user,
    setToken,
    setUser,
    logout,
  };
}, {
  persist: {
    key: 'user-store-key-OA',
    storage: typeof localStorage !== 'undefined' ? localStorage : null,
    paths: ['token', 'user'],
  },
});
