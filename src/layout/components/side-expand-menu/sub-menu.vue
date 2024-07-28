<!--
  * 第二列菜单区域
  * 
  * @Author:    1024创新实验室-主任：卓大 
  * @Date:      2022-09-06 20:29:12 
  * @Wechat:    zhuda1024 
  * @Email:     lab1024@163.com 
  * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012 
-->
<template>
  <a-sub-menu :key="props.menuInfo.id.toString()">
    <template #icon>
      <component :is="$antIcons[props.menuInfo.icon]" />
    </template>
    <template #title>{{ props.menuInfo.name }}</template>
    <template v-for="item in props.menuInfo.children" :key="item.id">
      <template v-if="item.show">
        <template v-if="!item.children">
          <a-menu-item :key="item.id.toString()" @click="turnToPage(item)">
            <template #icon>
              <component :is="$antIcons[item.icon]" />
            </template>
            {{ item.name }}
          </a-menu-item>
        </template>
        <template v-else>
          <SubMenu :menu-info="item" :key="item.id" @turnToPage="turnToPage" />
        </template>
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup>
  let props = defineProps({
    menuInfo: Object,
  });
  const emits = defineEmits(['turnToPage']);
  const turnToPage = (route) => {
    emits('turnToPage', route);
  };
</script>
<style scoped lang="less">
  ::v-deep(.ant-menu-item-selected) {
    border-right: 3px !important;
  }
</style>
