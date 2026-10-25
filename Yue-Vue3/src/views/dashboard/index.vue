<template>
  <div class="dashboard-container">
    <el-card shadow="never">
      <div class="welcome">
        <el-avatar :size="80" :src="avatar">
          <el-icon :size="36"><UserFilled /></el-icon>
        </el-avatar>
        <div class="welcome__text">
          <p class="welcome__title">{{ greetings }}</p>
          <p class="welcome__desc">欢迎使用 {{ defaultSettings.title }}</p>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="mt-4">
      <template #header>
        <span>账号信息</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ userStore.user.username || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ userStore.user.nickname || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="角色">
          {{ userStore.user.roles.join("、") || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="权限数量">
          {{ userStore.user.perms.length }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { UserFilled } from "@element-plus/icons-vue";
import defaultSettings from "@/settings";
import { useUserStore } from "@/store/modules/user";

defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

const userStore = useUserStore();

const avatar = computed(() => userStore.user.avatar || "");

const greetings = computed(() => {
  const hours = new Date().getHours();
  const nickname = userStore.user.nickname || userStore.user.username || "用户";
  if (hours >= 6 && hours < 12) {
    return `上午好，${nickname}！`;
  } else if (hours >= 12 && hours < 18) {
    return `下午好，${nickname}！`;
  } else {
    return `晚上好，${nickname}！`;
  }
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}

.welcome {
  display: flex;
  align-items: center;

  &__text {
    margin-left: 20px;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__desc {
    margin: 0;
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}
</style>
