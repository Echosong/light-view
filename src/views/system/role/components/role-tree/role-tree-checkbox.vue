<!--
  * 角色
  *
  * @Author:    二胡子
  * @Date:      2022-09-12 22:34:00
  * @Wechat:    zhuda1024
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
  *
-->
<template>
  <div style="overflow: auto">
    <a-checkbox-group v-model:value="checkedData">
      <div class="checked-box" style="min-width: 50%">
        <ul>
          <!--li 菜单模块 start-->
          <RoleTreeMenu :tree="props.tree" :index="0" />
          <!--li 菜单模块 end-->
        </ul>
      </div>
    </a-checkbox-group>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  import { useRoleStore } from '/src/store/modules/system/role';
  import RoleTreeMenu from './role-tree-menu.vue';

  let props = defineProps({
    tree: {
      type: Array,
      default: [],
    },
  });
  defineEmits(['update:value']);

  let roleStore = useRoleStore();
  let checkedData = ref();
  watch(
    () => roleStore.checkedData,
    (e) => (checkedData.value = e),
    {
      deep: true,
    }
  );
</script>
<style scoped lang="less">
  @import 'index.less';
</style>
