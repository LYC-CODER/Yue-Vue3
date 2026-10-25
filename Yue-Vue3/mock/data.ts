/**
 * Mock 内存数据。
 * 仅用于没有启动 Yue-Api 时演示前端功能，重启 Vite 后数据会重置。
 */

export const AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' rx='40' fill='%234080ff'/%3E%3Ctext x='50%25' y='56%25' text-anchor='middle' fill='white' font-size='30' font-family='Arial'%3EY%3C/text%3E%3C/svg%3E";

export interface MockUser {
  id: number;
  username: string;
  nickname: string;
  mobile: string;
  gender: number;
  avatar: string;
  email: string;
  status: number;
  deptId: number;
  roleIds: number[];
  createTime: string;
}

export interface MockRole {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  dataScope: number;
  createTime: string;
  updateTime: string;
}

export type MenuType = "C" | "M" | "B";

export interface MockMenu {
  id: number;
  parentId: number;
  name: string;
  type: MenuType;
  routeName: string;
  routePath: string;
  component: string;
  perm: string;
  visible: number;
  sort: number;
  icon: string;
  redirect: string;
  keepAlive: number;
  alwaysShow: number;
}

export interface MockDept {
  id: number;
  parentId: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface MockDict {
  id: number;
  name: string;
  dictCode: string;
  status: number;
  remark: string;
}

export interface MockDictItem {
  id: number;
  dictCode: string;
  label: string;
  value: string;
  sort: number;
  status: number;
  tagType: string;
}

export interface MockLog {
  id: number;
  module: string;
  content: string;
  requestUri: string;
  method: string;
  ip: string;
  region: string;
  browser: string;
  os: string;
  executionTime: number;
  createBy: number;
  createTime: string;
  operator: string;
}

export const users: MockUser[] = [
  {
    id: 1,
    username: "admin",
    nickname: "系统管理员",
    mobile: "13800138000",
    gender: 1,
    avatar: AVATAR,
    email: "admin@yue.local",
    status: 1,
    deptId: 1,
    roleIds: [1],
    createTime: "2026-01-01 10:00:00",
  },
  {
    id: 2,
    username: "test",
    nickname: "测试用户",
    mobile: "13900139000",
    gender: 2,
    avatar: "",
    email: "test@yue.local",
    status: 1,
    deptId: 2,
    roleIds: [2],
    createTime: "2026-02-01 09:30:00",
  },
  {
    id: 3,
    username: "disabled",
    nickname: "停用账号",
    mobile: "",
    gender: 0,
    avatar: "",
    email: "",
    status: 0,
    deptId: 3,
    roleIds: [2],
    createTime: "2026-03-01 08:00:00",
  },
];

export const roles: MockRole[] = [
  {
    id: 1,
    name: "超级管理员",
    code: "ROOT",
    sort: 1,
    status: 1,
    dataScope: 1,
    createTime: "2026-01-01 10:00:00",
    updateTime: "2026-01-01 10:00:00",
  },
  {
    id: 2,
    name: "普通用户",
    code: "USER",
    sort: 2,
    status: 1,
    dataScope: 4,
    createTime: "2026-01-02 10:00:00",
    updateTime: "2026-01-02 10:00:00",
  },
];

export const menus: MockMenu[] = [
  {
    id: 1,
    parentId: 0,
    name: "系统管理",
    type: "C",
    routeName: "System",
    routePath: "/system",
    component: "Layout",
    perm: "",
    visible: 1,
    sort: 1,
    icon: "system",
    redirect: "/system/user",
    keepAlive: 0,
    alwaysShow: 1,
  },
  {
    id: 2,
    parentId: 1,
    name: "用户管理",
    type: "M",
    routeName: "User",
    routePath: "user",
    component: "system/user/index",
    perm: "",
    visible: 1,
    sort: 1,
    icon: "user",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  {
    id: 3,
    parentId: 1,
    name: "角色管理",
    type: "M",
    routeName: "Role",
    routePath: "role",
    component: "system/role/index",
    perm: "",
    visible: 1,
    sort: 2,
    icon: "role",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  {
    id: 4,
    parentId: 1,
    name: "菜单管理",
    type: "M",
    routeName: "Menu",
    routePath: "menu",
    component: "system/menu/index",
    perm: "",
    visible: 1,
    sort: 3,
    icon: "menu",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  {
    id: 5,
    parentId: 1,
    name: "部门管理",
    type: "M",
    routeName: "Dept",
    routePath: "dept",
    component: "system/dept/index",
    perm: "",
    visible: 1,
    sort: 4,
    icon: "tree",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  {
    id: 6,
    parentId: 1,
    name: "字典管理",
    type: "M",
    routeName: "Dict",
    routePath: "dict",
    component: "system/dict/index",
    perm: "",
    visible: 1,
    sort: 5,
    icon: "dict",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  {
    id: 7,
    parentId: 1,
    name: "操作日志",
    type: "M",
    routeName: "Log",
    routePath: "log",
    component: "system/log/index",
    perm: "",
    visible: 1,
    sort: 6,
    icon: "document",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  {
    id: 8,
    parentId: 1,
    name: "字典项",
    type: "M",
    routeName: "DictItem",
    routePath: "dict-item",
    component: "system/dict/dict-item",
    perm: "",
    visible: 0,
    sort: 7,
    icon: "dict",
    redirect: "",
    keepAlive: 1,
    alwaysShow: 0,
  },
  ...(
    [
      [20, 2, "新增用户", "sys:user:create"],
      [21, 2, "修改用户", "sys:user:update"],
      [22, 2, "删除用户", "sys:user:delete"],
      [23, 2, "重置密码", "sys:user:reset-password"],
      [24, 2, "导入用户", "sys:user:import"],
      [25, 2, "导出用户", "sys:user:export"],
      [30, 3, "新增角色", "sys:role:create"],
      [31, 3, "修改角色", "sys:role:update"],
      [32, 3, "删除角色", "sys:role:delete"],
      [33, 3, "分配权限", "sys:role:assign"],
      [40, 4, "新增菜单", "sys:menu:create"],
      [41, 4, "修改菜单", "sys:menu:update"],
      [42, 4, "删除菜单", "sys:menu:delete"],
      [50, 5, "新增部门", "sys:dept:create"],
      [51, 5, "修改部门", "sys:dept:update"],
      [52, 5, "删除部门", "sys:dept:delete"],
      [60, 6, "新增字典", "sys:dict:create"],
      [61, 6, "修改字典", "sys:dict:update"],
      [62, 6, "删除字典", "sys:dict:delete"],
      [63, 8, "新增字典项", "sys:dict-item:create"],
      [64, 8, "修改字典项", "sys:dict-item:update"],
      [65, 8, "删除字典项", "sys:dict-item:delete"],
    ] as [number, number, string, string][]
  ).map(([id, parentId, name, perm]) => ({
    id,
    parentId,
    name,
    type: "B" as MenuType,
    routeName: "",
    routePath: "",
    component: "",
    perm,
    visible: 1,
    sort: id,
    icon: "",
    redirect: "",
    keepAlive: 0,
    alwaysShow: 0,
  })),
];

export const roleMenus: Record<number, number[]> = {
  1: menus.map((menu) => menu.id),
  2: [1, 2, 8],
};

export const depts: MockDept[] = [
  {
    id: 1,
    parentId: 0,
    name: "总部",
    code: "HQ",
    sort: 1,
    status: 1,
    createTime: "2026-01-01 10:00:00",
    updateTime: "2026-01-01 10:00:00",
  },
  {
    id: 2,
    parentId: 1,
    name: "研发部",
    code: "RD",
    sort: 1,
    status: 1,
    createTime: "2026-01-02 10:00:00",
    updateTime: "2026-01-02 10:00:00",
  },
  {
    id: 3,
    parentId: 1,
    name: "测试部",
    code: "QA",
    sort: 2,
    status: 1,
    createTime: "2026-01-03 10:00:00",
    updateTime: "2026-01-03 10:00:00",
  },
  {
    id: 4,
    parentId: 1,
    name: "产品部",
    code: "PM",
    sort: 3,
    status: 0,
    createTime: "2026-01-04 10:00:00",
    updateTime: "2026-01-04 10:00:00",
  },
];

export const dicts: MockDict[] = [
  { id: 1, name: "性别", dictCode: "gender", status: 1, remark: "用户性别" },
  {
    id: 2,
    name: "通用状态",
    dictCode: "sys_status",
    status: 1,
    remark: "启用/禁用",
  },
];

export const dictItems: MockDictItem[] = [
  {
    id: 1,
    dictCode: "gender",
    label: "男",
    value: "1",
    sort: 1,
    status: 1,
    tagType: "primary",
  },
  {
    id: 2,
    dictCode: "gender",
    label: "女",
    value: "2",
    sort: 2,
    status: 1,
    tagType: "danger",
  },
  {
    id: 3,
    dictCode: "sys_status",
    label: "正常",
    value: "1",
    sort: 1,
    status: 1,
    tagType: "success",
  },
  {
    id: 4,
    dictCode: "sys_status",
    label: "禁用",
    value: "0",
    sort: 2,
    status: 1,
    tagType: "info",
  },
];

export const logs: MockLog[] = [
  {
    id: 1,
    module: "用户管理",
    content: "新增用户",
    requestUri: "/api/v1/users/saveUser",
    method: "POST",
    ip: "127.0.0.1",
    region: "本机",
    browser: "Chrome",
    os: "Windows",
    executionTime: 12,
    createBy: 1,
    createTime: "2026-10-24 10:00:00",
    operator: "admin",
  },
  {
    id: 2,
    module: "角色管理",
    content: "分配权限",
    requestUri: "/api/v1/roles/1/menus",
    method: "PUT",
    ip: "127.0.0.1",
    region: "本机",
    browser: "Chrome",
    os: "Windows",
    executionTime: 8,
    createBy: 1,
    createTime: "2026-10-24 10:05:00",
    operator: "admin",
  },
  {
    id: 3,
    module: "菜单管理",
    content: "修改菜单",
    requestUri: "/api/v1/menus/2",
    method: "PUT",
    ip: "127.0.0.1",
    region: "本机",
    browser: "Chrome",
    os: "Windows",
    executionTime: 6,
    createBy: 1,
    createTime: "2026-10-24 10:10:00",
    operator: "admin",
  },
];

/** 用户分页对象（补齐部门名称、角色名称） */
export function toUserVO(user: MockUser) {
  const dept = depts.find((item) => item.id === user.deptId);
  const roleNames = roles
    .filter((role) => user.roleIds.includes(role.id))
    .map((role) => role.name)
    .join(",");
  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    mobile: user.mobile,
    gender: user.gender,
    avatar: user.avatar,
    email: user.email,
    status: user.status,
    deptName: dept?.name ?? "",
    roleNames,
    createTime: user.createTime,
  };
}

/** 构建菜单树 */
export function buildMenuTree(parentId = 0): any[] {
  return menus
    .filter((menu) => menu.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map((menu) => {
      const children = buildMenuTree(menu.id);
      return children.length ? { ...menu, children } : { ...menu };
    });
}

/** 构建菜单下拉树 */
export function buildMenuOptions(onlyParent = false, parentId = 0): any[] {
  return menus
    .filter(
      (menu) =>
        menu.parentId === parentId &&
        (!onlyParent || menu.type === "C" || menu.type === "M")
    )
    .sort((a, b) => a.sort - b.sort)
    .map((menu) => {
      const children = buildMenuOptions(onlyParent, menu.id);
      return {
        value: menu.id,
        label: menu.name,
        ...(children.length ? { children } : {}),
      };
    });
}

/** 构建用户动态路由 */
export function buildRoutes(parentId = 0): any[] {
  return menus
    .filter((menu) => menu.parentId === parentId && menu.type !== "B")
    .sort((a, b) => a.sort - b.sort)
    .map((menu) => {
      const children = buildRoutes(menu.id);
      return {
        path: menu.routePath,
        component: menu.type === "C" ? "Layout" : menu.component,
        name: menu.routeName,
        ...(menu.redirect ? { redirect: menu.redirect } : {}),
        meta: {
          title: menu.name,
          icon: menu.icon,
          hidden: menu.visible === 0,
          keepAlive: menu.keepAlive === 1,
          alwaysShow: menu.alwaysShow === 1,
        },
        ...(children.length ? { children } : {}),
      };
    });
}

/** 构建部门树 */
export function buildDeptTree(parentId = 0): any[] {
  return depts
    .filter((dept) => dept.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map((dept) => {
      const children = buildDeptTree(dept.id);
      return children.length ? { ...dept, children } : { ...dept };
    });
}

/** 构建部门下拉树 */
export function buildDeptOptions(parentId = 0): any[] {
  return depts
    .filter((dept) => dept.parentId === parentId)
    .sort((a, b) => a.sort - b.sort)
    .map((dept) => {
      const children = buildDeptOptions(dept.id);
      return {
        value: dept.id,
        label: dept.name,
        ...(children.length ? { children } : {}),
      };
    });
}
