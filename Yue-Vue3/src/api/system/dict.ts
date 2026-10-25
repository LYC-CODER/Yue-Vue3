import request from "@/utils/request";
import type {
  DictTypeQueryParams,
  DictTypeItem,
  DictTypeForm,
  DictItemQueryParams,
  DictItem,
  DictItemForm,
  DictItemOption,
  OptionItem,
  PageResult,
} from "@/types/api";

const DICT_BASE_URL = "/api/v1/dicts";

const DICT_TAG_TYPES = ["primary", "success", "info", "warning", "danger"];

/**
 * 统一标签类型。
 * 兼容历史数据中的单字母编码（P/S/W/I/D/N）和 Element Plus 的类型名。
 */
function normalizeTagType(value?: unknown): DictItemForm["tagType"] {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  const codeMap: Record<string, DictItemForm["tagType"]> = {
    P: "primary",
    S: "success",
    W: "warning",
    I: "info",
    D: "danger",
    N: "",
  };
  const byCode = codeMap[raw.toUpperCase()];
  if (byCode !== undefined) return byCode;

  const lower = raw.toLowerCase();
  return DICT_TAG_TYPES.includes(lower)
    ? (lower as DictItemForm["tagType"])
    : "";
}

const DictAPI = {
  /** 字典分页列表 */
  getPage(queryParams: DictTypeQueryParams) {
    return request<any, PageResult<DictTypeItem>>({
      url: `${DICT_BASE_URL}`,
      method: "get",
      params: queryParams,
    });
  },

  /** 字典下拉列表 */
  getList() {
    return request<any, OptionItem[]>({
      url: `${DICT_BASE_URL}/options`,
      method: "get",
    });
  },

  /** 字典表单数据 */
  getFormData(id: string) {
    return request<any, DictTypeForm>({
      url: `${DICT_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /** 新增字典 */
  create(data: DictTypeForm) {
    return request({ url: `${DICT_BASE_URL}`, method: "post", data });
  },

  /** 修改字典 */
  update(id: string, data: DictTypeForm) {
    return request({ url: `${DICT_BASE_URL}/${id}`, method: "put", data });
  },

  /** 删除字典，多个 ID 以英文逗号分隔 */
  deleteByIds(ids: string) {
    return request({ url: `${DICT_BASE_URL}/${ids}`, method: "delete" });
  },

  /** 字典项分页列表 */
  getDictItemPage(dictCode: string, queryParams: DictItemQueryParams) {
    return request<any, PageResult<DictItem>>({
      url: `${DICT_BASE_URL}/${dictCode}/items`,
      method: "get",
      params: queryParams,
    });
  },

  /** 字典项下拉列表（只返回启用项） */
  getDictItems(dictCode: string) {
    return request<any, DictItemOption[]>({
      url: `${DICT_BASE_URL}/${dictCode}/items/options`,
      method: "get",
    }).then((items) =>
      (items ?? []).map((item) => ({
        ...item,
        tagType: normalizeTagType(item.tagType),
      }))
    );
  },

  /** 新增字典项 */
  createDictItem(dictCode: string, data: DictItemForm) {
    return request({
      url: `${DICT_BASE_URL}/${dictCode}/items`,
      method: "post",
      data: { ...data, tagType: normalizeTagType(data.tagType) },
    });
  },

  /** 字典项表单数据 */
  getDictItemFormData(dictCode: string, id: string) {
    return request<any, DictItemForm>({
      url: `${DICT_BASE_URL}/${dictCode}/items/${id}/form`,
      method: "get",
    }).then((form) => ({
      ...form,
      tagType: normalizeTagType(form.tagType),
    }));
  },

  /** 修改字典项 */
  updateDictItem(dictCode: string, id: string, data: DictItemForm) {
    return request({
      url: `${DICT_BASE_URL}/${dictCode}/items/${id}`,
      method: "put",
      data: { ...data, tagType: normalizeTagType(data.tagType) },
    });
  },

  /** 删除字典项，多个 ID 以英文逗号分隔 */
  deleteDictItems(dictCode: string, ids: string) {
    return request({
      url: `${DICT_BASE_URL}/${dictCode}/items/${ids}`,
      method: "delete",
    });
  },
};

export default DictAPI;
