import request from "@/utils/request";
import type {
  UserInfo,
  UserQueryParams,
  UserItem,
  UserForm,
  UserProfileDetail,
  UserProfileForm,
  PasswordChangeForm,
  PasswordVerifyForm,
  MobileUpdateForm,
  EmailUpdateForm,
  PageResult,
  OptionItem,
  ExcelResult,
} from "@/types/api";

const USER_BASE_URL = "/api/v1/users";

const UserAPI = {
  /** 获取当前登录用户信息（含角色、权限） */
  getInfo() {
    return request<any, UserInfo>({
      url: `${USER_BASE_URL}/me`,
      method: "get",
    });
  },

  /** 用户分页列表 */
  getPage(queryParams: UserQueryParams) {
    return request<any, PageResult<UserItem>>({
      url: `${USER_BASE_URL}/list`,
      method: "get",
      params: queryParams,
    });
  },

  /** 获取用户表单数据 */
  getFormData(userId: string) {
    return request<any, UserForm>({
      url: `${USER_BASE_URL}/${userId}/form`,
      method: "get",
    });
  },

  /** 新增用户 */
  create(data: UserForm) {
    return request({
      url: `${USER_BASE_URL}/saveUser`,
      method: "post",
      data,
    });
  },

  /** 修改用户 */
  update(id: string, data: UserForm) {
    return request({
      url: `${USER_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  },

  /** 重置指定用户密码 */
  resetPassword(id: string, password: string) {
    return request({
      url: `${USER_BASE_URL}/${id}/password/reset`,
      method: "put",
      params: { password },
    });
  },

  /** 删除用户，多个 ID 以英文逗号分隔 */
  deleteByIds(ids: string) {
    return request({
      url: `${USER_BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  /** 下载用户导入模板 */
  downloadTemplate() {
    return request({
      url: `${USER_BASE_URL}/template`,
      method: "get",
      responseType: "blob",
    });
  },

  /** 导出用户 */
  export(queryParams: UserQueryParams) {
    return request({
      url: `${USER_BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "blob",
    });
  },

  /** 导入用户 */
  import(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<any, ExcelResult>({
      url: `${USER_BASE_URL}/import`,
      method: "post",
      data: formData,
    });
  },

  /** 个人中心用户信息 */
  getProfile() {
    return request<any, UserProfileDetail>({
      url: `${USER_BASE_URL}/profile`,
      method: "get",
    });
  },

  /** 修改个人中心用户信息 */
  updateProfile(data: UserProfileForm) {
    return request({
      url: `${USER_BASE_URL}/profile`,
      method: "put",
      data,
    });
  },

  /** 修改当前用户密码 */
  changePassword(data: PasswordChangeForm) {
    return request({
      url: `${USER_BASE_URL}/password`,
      method: "put",
      data,
    });
  },

  /** 绑定或更换手机号 */
  bindOrChangeMobile(data: MobileUpdateForm) {
    return request({
      url: `${USER_BASE_URL}/mobile`,
      method: "put",
      data,
    });
  },

  /** 解绑手机号 */
  unbindMobile(data: PasswordVerifyForm) {
    return request({
      url: `${USER_BASE_URL}/mobile`,
      method: "delete",
      data,
    });
  },

  /** 绑定或更换邮箱 */
  bindOrChangeEmail(data: EmailUpdateForm) {
    return request({
      url: `${USER_BASE_URL}/email`,
      method: "put",
      data,
    });
  },

  /** 解绑邮箱 */
  unbindEmail(data: PasswordVerifyForm) {
    return request({
      url: `${USER_BASE_URL}/email`,
      method: "delete",
      data,
    });
  },

  /** 用户下拉选项 */
  getOptions() {
    return request<any, OptionItem[]>({
      url: `${USER_BASE_URL}/options`,
      method: "get",
    });
  },
};

export default UserAPI;
