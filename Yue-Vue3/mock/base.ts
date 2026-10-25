import { createDefineMock } from "vite-plugin-mock-dev-server";

/**
 * 统一拼接 mock 接口前缀。
 * 前端请求前缀为 /dev-api，mock 接口实际路径为 /dev-api/api/v1/**。
 */
export const defineMock = createDefineMock((mock) => {
  const base = String(import.meta.env.VITE_APP_BASE_API || "/dev-api").replace(
    /\/$/,
    ""
  );
  mock.url = `${base}/api/v1/${mock.url.replace(/^\//, "")}`;
});

/** 成功响应 */
export function ok(data: unknown = null, msg = "操作成功") {
  return { code: "00000", msg, data };
}

/** 失败响应（HTTP 状态仍为 200，由前端根据 code 提示） */
export function fail(msg: string, code = "A0400") {
  return { code, msg, data: null };
}

/** 分页响应，结构与 Yue-Api PageResult 一致 */
export function pageResult<T>(list: T[], query: Record<string, any>) {
  const pageNum = Number(query.pageNum ?? 1);
  const pageSize = Number(query.pageSize ?? 10);
  const start = (pageNum - 1) * pageSize;
  return {
    code: "00000",
    msg: "操作成功",
    data: list.slice(start, start + pageSize),
    page: {
      pageNum,
      pageSize,
      total: list.length,
    },
  };
}

/** 逗号分隔的 ID 字符串转数字数组 */
export function toIds(value: unknown): number[] {
  return String(value ?? "")
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
}

/** 根据扁平数据构建树 */
export function toTree<T extends { id: number; parentId: number }>(
  items: T[],
  parentId = 0
): T[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => {
      const children = toTree(items, item.id);
      return children.length ? { ...item, children } : { ...item };
    });
}
