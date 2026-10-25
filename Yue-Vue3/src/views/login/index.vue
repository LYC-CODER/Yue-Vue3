<template>
  <div class="login-container">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <el-switch
        v-model="isDark"
        inline-prompt
        active-icon="Moon"
        inactive-icon="Sunny"
        @change="toggleTheme"
      />
      <lang-select class="ml-2 cursor-pointer" />
    </div>

    <!-- 登录表单 -->
    <el-card class="login-card">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <p class="login-subtitle">与 Yue-Api 对接的后台管理系统</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <div class="input-wrapper">
            <i-ep-user class="mx-2" />
            <el-input
              v-model="loginData.username"
              :placeholder="$t('login.username')"
              name="username"
              size="large"
              class="h-[48px]"
            />
          </div>
        </el-form-item>

        <!-- 密码 -->
        <el-tooltip
          :visible="isCapslock"
          :content="$t('login.capsLock')"
          placement="right"
        >
          <el-form-item prop="password">
            <div class="input-wrapper">
              <i-ep-lock class="mx-2" />
              <el-input
                v-model="loginData.password"
                :placeholder="$t('login.password')"
                type="password"
                name="password"
                @keyup="checkCapslock"
                @keyup.enter="handleLoginSubmit"
                size="large"
                class="h-[48px] pr-2"
                show-password
              />
            </div>
          </el-form-item>
        </el-tooltip>

        <!-- 验证码 -->
        <el-form-item prop="captchaCode">
          <div class="input-wrapper">
            <svg-icon icon-class="captcha" class="mx-2" />
            <el-input
              v-model="loginData.captchaCode"
              auto-complete="off"
              size="large"
              class="flex-1"
              :placeholder="$t('login.captchaCode')"
              @keyup.enter="handleLoginSubmit"
            />
            <el-image
              :src="captchaBase64"
              fit="fill"
              class="captcha-image"
              @click="getCaptcha"
            >
              <template #error>
                <div class="captcha-placeholder" @click="getCaptcha">
                  点击刷新
                </div>
              </template>
            </el-image>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="w-full"
          @click.prevent="handleLoginSubmit"
        >
          {{ $t("login.login") }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute, type LocationQuery } from "vue-router";

import { useSettingsStore, useUserStore } from "@/store";
import type { LoginRequest } from "@/types/api";
import AuthAPI from "@/api/auth";
import router from "@/router";
import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";

import type { FormInstance } from "element-plus";
import "@/styles/login.scss";

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
const { t } = useI18n();

// 是否暗黑模式
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
// 按钮 loading 状态
const loading = ref(false);
// 是否大写锁定
const isCapslock = ref(false);
// 验证码图片
const captchaBase64 = ref("");
// 登录表单 ref
const loginFormRef = ref<FormInstance>();

const loginData = ref<LoginRequest>({
  username: "",
  password: "",
  captchaId: "",
  captchaCode: "",
});

const loginRules = computed(() => ({
  username: [
    {
      required: true,
      trigger: "blur",
      message: t("login.message.username.required"),
    },
  ],
  password: [
    {
      required: true,
      trigger: "blur",
      message: t("login.message.password.required"),
    },
    {
      min: 6,
      message: t("login.message.password.min"),
      trigger: "blur",
    },
  ],
  captchaCode: [
    {
      required: true,
      trigger: "blur",
      message: t("login.message.captchaCode.required"),
    },
  ],
}));

/** 获取图形验证码 */
async function getCaptcha(): Promise<void> {
  try {
    const data = await AuthAPI.getCaptcha();
    loginData.value.captchaId = data.captchaId;
    captchaBase64.value = data.captchaBase64;
  } catch {
    captchaBase64.value = "";
  }
}

/** 登录表单提交 */
function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    userStore
      .login(loginData.value)
      .then(() => {
        const { path, queryParams } = parseRedirect();
        router.push({ path, query: queryParams });
      })
      .catch(() => {
        // 登录失败后刷新验证码
        loginData.value.captchaCode = "";
        getCaptcha();
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

/** 解析 redirect 字符串为 path 和 queryParams */
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

/** 主题切换 */
const toggleTheme = () => {
  const newTheme =
    settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="scss" scoped>
.login-subtitle {
  margin-top: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.captcha-image {
  flex-shrink: 0;
  width: 120px;
  height: 44px;
  margin-left: 8px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
}

.captcha-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}
</style>
