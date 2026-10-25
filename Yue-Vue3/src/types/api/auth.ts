/**
 * 认证相关类型定义
 */

/** 登录请求参数 */
export interface LoginRequest {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码缓存 ID */
  captchaId?: string;
  /** 验证码 */
  captchaCode?: string;
}

/** 登录响应 */
export interface LoginResponse {
  /** 访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 令牌类型，固定为 Bearer */
  tokenType: string;
  /** 过期时间(单位:秒) */
  expiresIn: number;
}

/** 图形验证码 */
export interface CaptchaInfo {
  /** 验证码缓存 ID */
  captchaId: string;
  /** 验证码图片 Base64 / data URI */
  captchaBase64: string;
}
