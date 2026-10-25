<template>
  <div class="error-page">
    <el-result
      icon="warning"
      title="401"
      sub-title="抱歉，你没有权限访问该页面"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
        <el-button @click="router.back()">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

defineOptions({
  name: "Page401",
});

const router = useRouter();
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
}
</style>
