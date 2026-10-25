import request from "@/utils/request";
import type {
  CaptchaInfo,
  LoginRequest,
  LoginResponse,
} from "@/types/api/auth";

const AUTH_BASE_URL = "/api/v1/auth";

const AuthAPI = {
  /** 账号密码登录 */
  login(data: LoginRequest) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/login`,
      method: "post",
      data: {
        username: data.username,
        password: data.password,
        captchaId: data.captchaId,
        captchaCode: data.captchaCode,
      },
    });
  },

  /** 获取图形验证码 */
  getCaptcha() {
    return request<any, CaptchaInfo>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },

  /** 刷新令牌 */
  refreshToken(refreshToken: string) {
    return request<any, LoginResponse>({
      url: `${AUTH_BASE_URL}/refresh-token`,
      method: "post",
      params: { refreshToken },
    });
  },

  /** 退出登录 */
  logout() {
    return request({
      url: `${AUTH_BASE_URL}/logout`,
      method: "delete",
    });
  },
};

export default AuthAPI;
