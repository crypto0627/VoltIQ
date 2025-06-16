// stores/useUserStore.ts
import { create } from "zustand";

// 定義使用者資料的類型，根據 /api/auth/me 的回應結構
interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  // 根據你的 User model 可能還有其他屬性
}

interface UserState {
  user: User | null;
  isLoading: boolean; // 新增 loading 狀態
  error: string | null; // 新增錯誤狀態
  isLoggedOut: boolean; // 新增登出狀態
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>; // 新增一個用於非同步獲取使用者資料的 action
  setIsLoggedOut: (isLoggedOut: boolean) => void; // 新增設定登出狀態的 action
  logout: () => Promise<void>; // 新增登出 action
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isLoggedOut: false, // 初始狀態為未登出
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    if (get().isLoading || get().user) return;
    set({ isLoading: true, error: null, isLoggedOut: false });
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        set({ user: null, isLoading: false, error: "Failed to fetch user", isLoggedOut: true });
        return;
      }
      const data = await res.json();
      set({ user: data, isLoading: false, isLoggedOut: false });
    } catch (err: any) {
      set({ user: null, isLoading: false, error: err.message, isLoggedOut: true });
    }
  },
  setIsLoggedOut: (isLoggedOut) => set({ isLoggedOut }),
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }
      set({ user: null, isLoading: false, error: null, isLoggedOut: true });
    } catch (error: any) {
      set({ isLoading: false, error: error.message, isLoggedOut: false });
    }
  },
}));

export default useUserStore;
