// stores/useUserStore.ts
import { create } from 'zustand';

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
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>; // 新增一個用於非同步獲取使用者資料的 action
}

const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    if (get().isLoading || get().user) return;
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      set({ user: data, isLoading: false });
    } catch (err: any) {
      set({ user: null, isLoading: false, error: err.message });
    }
  },
}));

export default useUserStore;