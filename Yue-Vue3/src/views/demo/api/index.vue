<template>
  <div class="api-docs-container">
    <iframe
      v-if="docUrl"
      :src="docUrl"
      title="API 文档"
      frameborder="0"
      width="100%"
      height="100%"
      class="api-docs-iframe"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Apidoc",
});

/**
 * Knife4j 文档地址。
 * 开发环境使用 VITE_APP_API_URL，生产环境回退到 /prod-api。
 */
const docUrl = computed(() => {
  const base = import.meta.env.VITE_APP_API_URL || "/prod-api";
  return `${base.replace(/\/$/, "")}/doc.html#/home`;
});
</script>

<style scoped lang="scss">
.api-docs-container {
  width: 100%;
  height: calc(100vh - 84px);
  overflow: hidden;

  .api-docs-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
</style>
