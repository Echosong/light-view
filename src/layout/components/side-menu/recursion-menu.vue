<!--
  * 传统菜单-递归菜单
  * 
  * @Author:    二胡子
  * @Date:      2022-09-06 20:29:12 
  * @Wechat:    zhuda1024 
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
-->
<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    class="smart-menu"
    mode="inline"
    :theme="theme"
    :inlineCollapsed="collapsed"
  >
    <template v-for="item in menuTree" :key="item.id">
      <template v-if="item.show">
        <template v-if="$lodash.isEmpty(item.children)">
          <a-menu-item :key="item.id" @click="turnToPage(item)">
            <template #icon>
              <component :is="$antIcons[item.icon]" />
            </template>
            {{ item.name }}个
          </a-menu-item>
        </template>
        <template v-else>
          <SubMenu :menu-info="item" :key="item.id" @turnToPage="turnToPage" />
        </template>
      </template>
    </template>
  </a-menu>
</template>
<script setup>
  import _ from 'lodash';
  import { computed, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import SubMenu from './sub-menu.vue';
  import { router } from '/@/router/index';
  import { useAppConfigStore } from '/@/store/modules/system/app-config';
  import { useUserStore } from '/@/store/modules/system/user';

  const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);

  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false,
    },
  });

  const menuTree = computed(() => useUserStore().getMenuTree || []);

  console.log("到这个菜单了xxx", useUserStore().getMenuTree  )

  //展开的菜单
  let currentRoute = useRoute();
  const selectedKeys = ref([]);
  const openKeys = ref([]);

  // 页面跳转
  function turnToPage(menu) {
    useUserStore().deleteKeepAliveIncludes(menu.id.toString());
    router.push({ path: menu.path });
  }

  /**
   * LightAdmin中 router的name 就是 后端存储menu的id
   * 所以此处可以直接监听路由，根据路由更新菜单的选中和展开
   */
  function updateOpenKeysAndSelectKeys() {
    // 更新选中
    selectedKeys.value = [_.toNumber(currentRoute.name)];

    /**
     * 更新展开（1、获取新展开的menu key集合；2、保留原有的openkeys，然后把新展开的与之合并）
     */
    //获取需要展开的menu key集合
    let menuParentIdListMap = useUserStore().getMenuParentIdListMap;
    let parentList = menuParentIdListMap.get(currentRoute.name) || [];

    // 如果是折叠菜单的话，则不需要设置openkey
    if(!props.collapsed){
      // 使用lodash的union函数，进行 去重合并两个数组
      let needOpenKeys = _.map(parentList, 'name').map(Number);
      openKeys.value = _.union(openKeys.value, needOpenKeys);
    }
  }

  watch(
    currentRoute,
    () => {
      updateOpenKeysAndSelectKeys();
    },
    {
      immediate: true,
    }
  );

  defineExpose({
    updateOpenKeysAndSelectKeys,
  });
</script>

<style lang="less" scoped>
  .smart-menu {
    position: relative;
  }
</style>
