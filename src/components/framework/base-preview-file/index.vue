<script setup>
const props = defineProps({
  fileUrl: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <a-tag color="#3b5999">
    <a v-if="fileUrl" :href="fileUrl.split(',')[0] " target="_blank">
      <template #icon>
        <DiffOutlined/>
      </template>
      下载</a>
    <span v-else> 暂无</span>
  </a-tag>
</template>
<style scoped lang="scss"></style>