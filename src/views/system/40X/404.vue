<!--
  * 404 不存在 页面
  * 
  * @Author:    二胡子
  * @Date:      2022-08-08 20:46:18
  * @Wechat:    zhuda1024 
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
-->
<template>
  <a-result status="404" title="对不起，您访问的内容不存在！">
    <template #extra>
      <a-button type="primary" @click="goHome">返回首页</a-button>
    </template>
  </a-result>
</template>
<script setup>
  import { useRouter } from 'vue-router';
  import { HOME_PAGE_NAME } from '/@/constants/system/home-const';

  const router = useRouter();
  function goHome() {
    router.push({ name: HOME_PAGE_NAME });
  }
</script>
