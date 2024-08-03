<!--
  * 底部：版权、公司等信息
  *
  * @Author:    二胡子
  * @Date:      2022-09-06 20:29:12
  * @Wechat:    zhuda1024
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
-->
<template>
  <div class="version">
    <a target="_blank" class="smart-copyright" href="http://www.hn1024.cn/"> ©2012-{{ currentYear }} 湖南·长沙「1024软件科技有限公司」 LightAdmin </a>
    <a target="_blank" class="smart-version" href="https://LightAdmin.vip/views/other/change-log.html"> V3.4.0 </a>
  </div>
</template>
<script setup>
  import dayjs from 'dayjs';

  const currentYear = dayjs().year();
</script>

<style lang="less" scoped>
  .version {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    a {
      color: rgba(0, 0, 0, 0.45);
    }
    a:hover {
      color: @primary-color;
    }
  }
</style>
