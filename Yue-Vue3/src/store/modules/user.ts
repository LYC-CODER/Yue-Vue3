import AuthAPI from "@/api/auth";
import UserAPI from "@/api/system/user";
import type { LoginRequest, UserInfo } from "@/types";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { TOKEN_KEY } from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo>({
    roles: [],
    perms: [],
  });

  /** 登录并保存令牌 */
  async function login(loginData: LoginRequest): Promise<void> {
    const data = await AuthAPI.login(loginData);
    const tokenType = data.tokenType || "Bearer";
    localStorage.setItem(TOKEN_KEY, `${tokenType} ${data.accessToken}`);
  }

  /** 获取当前登录用户信息（昵称、头像、角色集合、权限集合） */
  async function getUserInfo(): Promise<UserInfo> {
    const data = await UserAPI.getInfo();
    if (!data) {
      throw new Error("登录状态已失效，请重新登录");
    }
    if (!data.roles || data.roles.length <= 0) {
      throw new Error("当前用户未分配角色，请联系管理员");
    }
    Object.assign(user.value, data);
    return data;
  }

  /** 退出登录 */
  async function logout(): Promise<void> {
    try {
      await AuthAPI.logout();
    } finally {
      clearAuth();
      // 重新加载以清空动态路由和 Pinia 状态
      location.reload();
    }
  }

  /** 清除本地登录状态，重置路由 */
  function resetToken(): Promise<void> {
    clearAuth();
    resetRouter();
    return Promise.resolve();
  }

  /** 清除令牌与用户信息 */
  function clearAuth(): void {
    localStorage.setItem(TOKEN_KEY, "");
    user.value = { roles: [], perms: [] };
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

/**
 * 用于在组件外部（如在 Pinia Store 中）使用 Pinia 提供的 store 实例。
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-pinia-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
