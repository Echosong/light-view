<!--
  * 角色 树形结构
  *
  * @Author:    二胡子
  * @Date:      2022-09-12 22:34:00
  * @Wechat:    zhuda1024
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
  *
-->
<template>
  <div>
    <div class="tree-header">
      <p>设置角色对应的功能操作、后台管理权限</p>
      <a-button v-if="selectRoleId" type="primary" @click="saveChange" v-privilege="'system:role:menu:update'"> 保存 </a-button>
    </div>
    <!-- 功能权限勾选部分 -->
    <RoleTreeCheckbox :tree="tree" />
  </div>
</template>
<script setup>
  import { inject, ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import _ from 'lodash';
  import RoleTreeCheckbox from './role-tree-checkbox.vue';
  import { roleMenuApi } from '/src/api/system/role-menu-api';
  import { useRoleStore } from '/src/store/modules/system/role';
  import { SmartLoading } from '/src/components/framework/smart-loading';
  import { smartSentry } from '/src/lib/smart-sentry';

  let roleStore = useRoleStore();
  let tree = ref();
  let selectRoleId = inject('selectRoleId');

  watch(selectRoleId, () => getRoleSelectedMenu(), {
    immediate: true,
  });

  async function getRoleSelectedMenu() {
    if (!selectRoleId.value) {
      return;
    }
    let res = await roleMenuApi.getRoleSelectedMenu(selectRoleId.value);
    let data = res.data;
    if (_.isEmpty(roleStore.treeMap)) {
      roleStore.initTreeMap(data.menuTreeList || []);
    }
    roleStore.initCheckedData(data.selectedMenuId || []);
    tree.value = data.menuTreeList;
  }
  async function saveChange() {
    let checkedData = roleStore.checkedData;
    if (_.isEmpty(checkedData)) {
      message.error('还未选择任何权限');
      return;
    }
    let params = {
      roleId: selectRoleId.value,
      menuIdList: checkedData,
    };
    SmartLoading.show();
    try {
      await roleMenuApi.updateRoleMenu(params);
      message.success('保存成功');
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }
</script>
<style scoped lang="less">
  @import 'index.less';
</style>
