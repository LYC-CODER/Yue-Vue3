import { Buffer } from "node:buffer";
import { defineMock, fail, ok, pageResult, toIds } from "./base";
import {
  AVATAR,
  buildDeptOptions,
  buildDeptTree,
  buildMenuOptions,
  buildMenuTree,
  buildRoutes,
  depts,
  dictItems,
  dicts,
  logs,
  menus,
  roleMenus,
  roles,
  toUserVO,
  users,
} from "./data";

/** 生成下一个自增 ID */
function nextId(list: { id: number }[]): number {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

/** 删除菜单（包含所有子菜单） */
function removeMenus(ids: number[]) {
  const removeIds = new Set(ids);
  let changed = true;
  while (changed) {
    changed = false;
    menus.forEach((menu) => {
      if (!removeIds.has(menu.id) && removeIds.has(menu.parentId)) {
        removeIds.add(menu.id);
        changed = true;
      }
    });
  }
  for (let i = menus.length - 1; i >= 0; i--) {
    if (removeIds.has(menus[i].id)) {
      menus.splice(i, 1);
    }
  }
  Object.keys(roleMenus).forEach((key) => {
    const roleId = Number(key);
    roleMenus[roleId] = roleMenus[roleId].filter((id) => !removeIds.has(id));
  });
}

const excelBuffer = () => Buffer.from("Yue-Vue3 mock excel");

const MOCK_CAPTCHA_ID = "mock-captcha-id";
const MOCK_CAPTCHA_CODE = "1234";
const MOCK_CAPTCHA_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="44">
    <rect width="120" height="44" fill="#f5f7fa"/>
    <path d="M4 32 L28 8 M35 38 L58 5 M70 36 L105 9 M12 12 L48 34 M62 8 L94 36" stroke="#c0c4cc" stroke-width="1"/>
    <text x="60" y="31" text-anchor="middle" font-size="24" font-family="Arial" font-weight="bold" fill="#4080ff" letter-spacing="4">${MOCK_CAPTCHA_CODE}</text>
  </svg>`
)}`;

export default defineMock([
  // ---------------------------------------------------------------- 认证
  {
    url: "auth/captcha",
    method: "GET",
    body: () =>
      ok({
        captchaId: MOCK_CAPTCHA_ID,
        captchaBase64: MOCK_CAPTCHA_IMAGE,
      }),
  },
  {
    url: "auth/login",
    method: "POST",
    body: ({ body }) => {
      if (String(body.captchaCode ?? "") !== MOCK_CAPTCHA_CODE) {
        return fail("验证码错误（Mock 验证码：1234）", "A0240");
      }
      if (body.username === "admin" && body.password === "123456") {
        return ok({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          tokenType: "Bearer",
          expiresIn: 7200,
        });
      }
      return fail("用户名或密码错误（Mock 账号：admin / 123456）", "A0210");
    },
  },
  {
    url: "auth/refresh-token",
    method: "POST",
    body: () =>
      ok({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      }),
  },
  {
    url: "auth/logout",
    method: "DELETE",
    body: () => ok(),
  },

  // ---------------------------------------------------------------- 用户
  {
    url: "users/me",
    method: "GET",
    body: () =>
      ok({
        userId: 1,
        username: "admin",
        nickname: "系统管理员",
        avatar: AVATAR,
        roles: ["ROOT"],
        perms: ["*"],
      }),
  },
  {
    url: "users/list",
    method: "GET",
    body: ({ query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      const list = users
        .filter((user) => {
          const matchedKeyword =
            !keywords ||
            [user.username, user.nickname, user.mobile].some((value) =>
              String(value).toLowerCase().includes(keywords)
            );
          const matchedStatus =
            query.status === undefined ||
            query.status === "" ||
            Number(query.status) === user.status;
          const matchedDept =
            !query.deptId || Number(query.deptId) === user.deptId;
          return matchedKeyword && matchedStatus && matchedDept;
        })
        .map(toUserVO);
      return pageResult(list, query);
    },
  },
  {
    url: "users/options",
    method: "GET",
    body: () =>
      ok(users.map((user) => ({ value: user.id, label: user.nickname }))),
  },
  {
    url: "users/profile",
    method: "GET",
    body: () => {
      const user = users[0];
      return ok({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        mobile: user.mobile,
        email: user.email,
        deptName: "总部",
        roleNames: "超级管理员",
        createTime: "2026-01-01",
      });
    },
  },
  {
    url: "users/profile",
    method: "PUT",
    body: ({ body }) => {
      Object.assign(users[0], body);
      return ok();
    },
  },
  {
    url: "users/password",
    method: "PUT",
    body: () => ok(),
  },
  {
    url: "users/mobile",
    method: "PUT",
    body: ({ body }) => {
      users[0].mobile = String(body.mobile ?? "");
      return ok();
    },
  },
  {
    url: "users/mobile",
    method: "DELETE",
    body: () => {
      users[0].mobile = "";
      return ok();
    },
  },
  {
    url: "users/email",
    method: "PUT",
    body: ({ body }) => {
      users[0].email = String(body.email ?? "");
      return ok();
    },
  },
  {
    url: "users/email",
    method: "DELETE",
    body: () => {
      users[0].email = "";
      return ok();
    },
  },
  {
    url: "users/template",
    method: "GET",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=mock-template.xlsx",
    },
    type: "buffer",
    body: excelBuffer,
  },
  {
    url: "users/export",
    method: "GET",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=mock-users.xlsx",
    },
    type: "buffer",
    body: excelBuffer,
  },
  {
    url: "users/import",
    method: "POST",
    body: () =>
      ok({
        code: "00000",
        validCount: 1,
        invalidCount: 0,
        messageList: [],
      }),
  },
  {
    url: "users/:id/form",
    method: "GET",
    body: ({ params }) => {
      const user = users.find((item) => item.id === Number(params.id));
      if (!user) return fail("用户不存在", "A0201");
      return ok({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        mobile: user.mobile,
        gender: user.gender,
        avatar: user.avatar,
        email: user.email,
        status: user.status,
        deptId: user.deptId,
        roleIds: user.roleIds,
      });
    },
  },
  {
    url: "users/saveUser",
    method: "POST",
    body: ({ body }) => {
      const user = {
        id: nextId(users),
        username: String(body.username ?? ""),
        nickname: String(body.nickname ?? ""),
        mobile: String(body.mobile ?? ""),
        gender: Number(body.gender ?? 0),
        avatar: String(body.avatar ?? ""),
        email: String(body.email ?? ""),
        status: Number(body.status ?? 1),
        deptId: Number(body.deptId ?? 0),
        roleIds: (body.roleIds ?? []).map(Number),
        createTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      };
      users.push(user);
      return ok();
    },
  },
  {
    url: "users/:id/password/reset",
    method: "PUT",
    body: () => ok(),
  },
  {
    url: "users/:id",
    method: "PUT",
    body: ({ params, body }) => {
      const user = users.find((item) => item.id === Number(params.id));
      if (!user) return fail("用户不存在", "A0201");
      Object.assign(user, body, {
        id: user.id,
        roleIds: (body.roleIds ?? user.roleIds).map(Number),
      });
      return ok();
    },
  },
  {
    url: "users/:ids",
    method: "DELETE",
    body: ({ params }) => {
      const ids = toIds(params.ids);
      ids.forEach((id) => {
        const index = users.findIndex((user) => user.id === id);
        if (index >= 0) users.splice(index, 1);
      });
      return ok();
    },
  },

  // ---------------------------------------------------------------- 角色
  {
    url: "roles",
    method: "GET",
    body: ({ query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      const list = roles.filter(
        (role) =>
          !keywords ||
          role.name.toLowerCase().includes(keywords) ||
          role.code.toLowerCase().includes(keywords)
      );
      return pageResult(list, query);
    },
  },
  {
    url: "roles/options",
    method: "GET",
    body: () => ok(roles.map((role) => ({ value: role.id, label: role.name }))),
  },
  {
    url: "roles/:id/form",
    method: "GET",
    body: ({ params }) => {
      const role = roles.find((item) => item.id === Number(params.id));
      return role ? ok(role) : fail("角色不存在", "A0400");
    },
  },
  {
    url: "roles",
    method: "POST",
    body: ({ body }) => {
      roles.push({
        id: nextId(roles),
        name: String(body.name ?? ""),
        code: String(body.code ?? ""),
        sort: Number(body.sort ?? 1),
        status: Number(body.status ?? 1),
        dataScope: Number(body.dataScope ?? 1),
        createTime: new Date().toLocaleString("zh-CN", { hour12: false }),
        updateTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      });
      return ok();
    },
  },
  {
    url: "roles/:id",
    method: "PUT",
    body: ({ params, body }) => {
      const role = roles.find((item) => item.id === Number(params.id));
      if (!role) return fail("角色不存在", "A0400");
      Object.assign(role, body, {
        id: role.id,
        updateTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      });
      return ok();
    },
  },
  {
    url: "roles/:ids",
    method: "DELETE",
    body: ({ params }) => {
      const ids = toIds(params.ids);
      ids.forEach((id) => {
        const index = roles.findIndex((role) => role.id === id);
        if (index >= 0) roles.splice(index, 1);
        delete roleMenus[id];
      });
      return ok();
    },
  },
  {
    url: "roles/:roleId/menuIds",
    method: "GET",
    body: ({ params }) => ok(roleMenus[Number(params.roleId)] ?? []),
  },
  {
    url: "roles/:roleId/menus",
    method: "PUT",
    body: ({ params, body }) => {
      roleMenus[Number(params.roleId)] = (Array.isArray(body) ? body : []).map(
        Number
      );
      return ok();
    },
  },

  // ---------------------------------------------------------------- 菜单
  {
    url: "menus",
    method: "GET",
    body: ({ query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      if (!keywords) return ok(buildMenuTree());
      return ok(
        menus
          .filter((menu) => menu.name.toLowerCase().includes(keywords))
          .map((menu) => ({ ...menu }))
      );
    },
  },
  {
    url: "menus/options",
    method: "GET",
    body: ({ query }) =>
      ok(
        buildMenuOptions(
          query.onlyParent === true || query.onlyParent === "true"
        )
      ),
  },
  {
    url: "menus/routes",
    method: "GET",
    body: () => ok(buildRoutes()),
  },
  {
    url: "menus/:id/form",
    method: "GET",
    body: ({ params }) => {
      const menu = menus.find((item) => item.id === Number(params.id));
      if (!menu) return fail("菜单不存在", "A0400");
      return ok({ ...menu, params: [] });
    },
  },
  {
    url: "menus",
    method: "POST",
    body: ({ body }) => {
      menus.push({
        id: nextId(menus),
        parentId: Number(body.parentId ?? 0),
        name: String(body.name ?? ""),
        type: body.type ?? "M",
        routeName: String(body.routeName ?? ""),
        routePath: String(body.routePath ?? ""),
        component: String(body.component ?? ""),
        perm: String(body.perm ?? ""),
        visible: Number(body.visible ?? 1),
        sort: Number(body.sort ?? 1),
        icon: String(body.icon ?? ""),
        redirect: String(body.redirect ?? ""),
        keepAlive: Number(body.keepAlive ?? 0),
        alwaysShow: Number(body.alwaysShow ?? 0),
      });
      return ok();
    },
  },
  {
    url: "menus/:id",
    method: "PUT",
    body: ({ params, body }) => {
      const menu = menus.find((item) => item.id === Number(params.id));
      if (!menu) return fail("菜单不存在", "A0400");
      Object.assign(menu, body, { id: menu.id });
      return ok();
    },
  },
  {
    url: "menus/:id",
    method: "DELETE",
    body: ({ params }) => {
      removeMenus([Number(params.id)]);
      return ok();
    },
  },

  // ---------------------------------------------------------------- 部门
  {
    url: "depts",
    method: "GET",
    body: ({ query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      if (keywords) {
        return ok(
          depts.filter((dept) => dept.name.toLowerCase().includes(keywords))
        );
      }
      if (query.status !== undefined && query.status !== "") {
        return ok(depts.filter((dept) => dept.status === Number(query.status)));
      }
      return ok(buildDeptTree());
    },
  },
  {
    url: "depts/options",
    method: "GET",
    body: () => ok(buildDeptOptions()),
  },
  {
    url: "depts/:id/form",
    method: "GET",
    body: ({ params }) => {
      const dept = depts.find((item) => item.id === Number(params.id));
      return dept ? ok(dept) : fail("部门不存在", "A0400");
    },
  },
  {
    url: "depts",
    method: "POST",
    body: ({ body }) => {
      const now = new Date().toLocaleString("zh-CN", { hour12: false });
      depts.push({
        id: nextId(depts),
        parentId: Number(body.parentId ?? 0),
        name: String(body.name ?? ""),
        code: String(body.code ?? ""),
        sort: Number(body.sort ?? 1),
        status: Number(body.status ?? 1),
        createTime: now,
        updateTime: now,
      });
      return ok();
    },
  },
  {
    url: "depts/:id",
    method: "PUT",
    body: ({ params, body }) => {
      const dept = depts.find((item) => item.id === Number(params.id));
      if (!dept) return fail("部门不存在", "A0400");
      Object.assign(dept, body, {
        id: dept.id,
        updateTime: new Date().toLocaleString("zh-CN", { hour12: false }),
      });
      return ok();
    },
  },
  {
    url: "depts/:ids",
    method: "DELETE",
    body: ({ params }) => {
      const ids = toIds(params.ids);
      ids.forEach((id) => {
        const index = depts.findIndex((dept) => dept.id === id);
        if (index >= 0) depts.splice(index, 1);
      });
      return ok();
    },
  },

  // ---------------------------------------------------------------- 字典
  {
    url: "dicts",
    method: "GET",
    body: ({ query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      const list = dicts.filter(
        (dict) =>
          !keywords ||
          dict.name.toLowerCase().includes(keywords) ||
          dict.dictCode.toLowerCase().includes(keywords)
      );
      return pageResult(list, query);
    },
  },
  {
    url: "dicts/options",
    method: "GET",
    body: () =>
      ok(dicts.map((dict) => ({ value: dict.dictCode, label: dict.name }))),
  },
  {
    url: "dicts/:id/form",
    method: "GET",
    body: ({ params }) => {
      const dict = dicts.find((item) => item.id === Number(params.id));
      return dict ? ok(dict) : fail("字典不存在", "A0400");
    },
  },
  {
    url: "dicts",
    method: "POST",
    body: ({ body }) => {
      dicts.push({
        id: nextId(dicts),
        name: String(body.name ?? ""),
        dictCode: String(body.dictCode ?? ""),
        status: Number(body.status ?? 1),
        remark: String(body.remark ?? ""),
      });
      return ok();
    },
  },
  {
    url: "dicts/:id",
    method: "PUT",
    body: ({ params, body }) => {
      const dict = dicts.find((item) => item.id === Number(params.id));
      if (!dict) return fail("字典不存在", "A0400");
      Object.assign(dict, body, { id: dict.id });
      return ok();
    },
  },
  {
    url: "dicts/:ids",
    method: "DELETE",
    body: ({ params }) => {
      const ids = toIds(params.ids);
      ids.forEach((id) => {
        const dict = dicts.find((item) => item.id === id);
        if (dict) {
          for (let i = dictItems.length - 1; i >= 0; i--) {
            if (dictItems[i].dictCode === dict.dictCode) dictItems.splice(i, 1);
          }
        }
        const index = dicts.findIndex((item) => item.id === id);
        if (index >= 0) dicts.splice(index, 1);
      });
      return ok();
    },
  },
  {
    url: "dicts/:dictCode/items",
    method: "GET",
    body: ({ params, query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      const list = dictItems
        .filter((item) => item.dictCode === params.dictCode)
        .filter(
          (item) =>
            !keywords ||
            item.label.toLowerCase().includes(keywords) ||
            item.value.toLowerCase().includes(keywords)
        );
      return pageResult(list, query);
    },
  },
  {
    url: "dicts/:dictCode/items/options",
    method: "GET",
    body: ({ params }) =>
      ok(
        dictItems
          .filter(
            (item) => item.dictCode === params.dictCode && item.status === 1
          )
          .map((item) => ({
            value: item.value,
            label: item.label,
            tagType: item.tagType,
          }))
      ),
  },
  {
    url: "dicts/:dictCode/items/:itemId/form",
    method: "GET",
    body: ({ params }) => {
      const item = dictItems.find(
        (dictItem) => dictItem.id === Number(params.itemId)
      );
      return item ? ok(item) : fail("字典项不存在", "A0400");
    },
  },
  {
    url: "dicts/:dictCode/items",
    method: "POST",
    body: ({ params, body }) => {
      dictItems.push({
        id: nextId(dictItems),
        dictCode: String(params.dictCode),
        label: String(body.label ?? ""),
        value: String(body.value ?? ""),
        sort: Number(body.sort ?? 1),
        status: Number(body.status ?? 1),
        tagType: String(body.tagType ?? ""),
      });
      return ok();
    },
  },
  {
    url: "dicts/:dictCode/items/:itemId",
    method: "PUT",
    body: ({ params, body }) => {
      const item = dictItems.find(
        (dictItem) => dictItem.id === Number(params.itemId)
      );
      if (!item) return fail("字典项不存在", "A0400");
      Object.assign(item, body, { id: item.id, dictCode: params.dictCode });
      return ok();
    },
  },
  {
    url: "dicts/:dictCode/items/:itemIds",
    method: "DELETE",
    body: ({ params }) => {
      toIds(params.itemIds).forEach((id) => {
        const index = dictItems.findIndex((item) => item.id === id);
        if (index >= 0) dictItems.splice(index, 1);
      });
      return ok();
    },
  },

  // ---------------------------------------------------------------- 日志
  {
    url: "logs",
    method: "GET",
    body: ({ query }) => {
      const keywords = String(query.keywords ?? "").toLowerCase();
      const list = logs.filter(
        (log) =>
          !keywords ||
          [log.content, log.requestUri, log.operator, log.region].some(
            (value) => String(value).toLowerCase().includes(keywords)
          )
      );
      return pageResult(list, query);
    },
  },

  // ---------------------------------------------------------------- 文件
  {
    url: "files",
    method: "POST",
    body: () => ok({ name: "mock-avatar.svg", url: AVATAR }),
  },
  {
    url: "files",
    method: "DELETE",
    body: () => ok(),
  },
]);
