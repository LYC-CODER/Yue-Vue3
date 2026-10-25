import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import qs from "qs";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

/** 会话失效统一处理 */
function handleTokenInvalid(): void {
  ElNotification({
    title: "提示",
    message: "您的会话已过期，请重新登录",
    type: "info",
  });
  useUserStoreHook()
    .resetToken()
    .then(() => {
      location.reload();
    });
}

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 二进制响应（导出文件等）直接返回完整响应，交由调用方处理
    if (
      response.config.responseType === "blob" ||
      response.config.responseType === "arraybuffer"
    ) {
      return response;
    }

    const result = response.data;
    if (!result || typeof result !== "object") {
      return result;
    }

    const { code, data, msg, page } = result;
    if (code === ResultEnum.SUCCESS) {
      // 分页响应：{ code, data: records, page: { total, ... } }
      if (page) {
        return { list: data ?? [], total: page.total ?? 0 };
      }
      return data;
    }

    ElMessage.error(msg || "系统出错");
    return Promise.reject(new Error(msg || "Error"));
  },
  (error: any) => {
    const response = error.response;
    const result = response?.data;

    if (result && result.code === ResultEnum.ACCESS_TOKEN_INVALID) {
      handleTokenInvalid();
    } else if (response?.status === 401) {
      handleTokenInvalid();
    } else if (result && typeof result === "object") {
      ElMessage.error(result.msg || "系统出错");
    } else if (error.code === "ECONNABORTED") {
      ElMessage.error("请求超时，请稍后重试");
    } else if (!response) {
      ElMessage.error("网络异常，请检查后端服务是否启动");
    } else {
      ElMessage.error(error.message || "系统出错");
    }

    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
