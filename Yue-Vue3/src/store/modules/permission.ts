import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import MenuAPI from "@/api/system/menu";
import { RouteItem } from "@/types/api/menu";

const viewModules: Record<string, any> = import.meta.glob(
  "../../views/**/*.vue"
);
const Layout = () => import("@/layout/index.vue");

export const usePermissionStore = defineStore("permission", () => {
  /** 所有路由，包括静态和动态路由 */
  const routes = ref<RouteRecordRaw[]>([]);
  /** 混合模式左侧菜单 */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);

  /**
   * 生成动态路由
   */
  function generateRoutes() {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      MenuAPI.getRoutes()
        .then((data) => {
          const dynamicRoutes = transformRoutes(data);
          routes.value = constantRoutes.concat(dynamicRoutes);
          resolve(dynamicRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 混合模式菜单下根据顶部菜单路径设置左侧菜单
   *
   * @param topMenuPath - 顶部菜单路径
   */
  const setMixLeftMenus = (topMenuPath: string) => {
    const matchedItem = routes.value.find((item) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  };

  return {
    routes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
  };
});

/**
 * 转换路由数据为组件
 */
const transformRoutes = (routes: RouteItem[]): RouteRecordRaw[] => {
  return routes.map((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw;

    // 顶级目录使用 Layout
    if (route.component === "Layout") {
      tmpRoute.component = Layout;
    } else {
      tmpRoute.component = resolveView(route.component);
    }

    if (route.children?.length) {
      tmpRoute.children = transformRoutes(route.children);
    } else {
      delete tmpRoute.children;
    }

    return tmpRoute;
  });
};

/** 根据后端组件路径加载 views 下的页面，找不到时回退 404 */
function resolveView(component?: string | null) {
  if (!component) {
    return viewModules["../../views/error-page/404.vue"];
  }
  const normalized = component
    .replace(/^@\/views\//, "")
    .replace(/^\/+/, "")
    .replace(/\.vue$/i, "");
  return (
    viewModules[`../../views/${normalized}.vue`] ??
    viewModules["../../views/error-page/404.vue"]
  );
}

/**
 * 在组件外使用 Pinia store 实例
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
