<!--
  * 头像
  *
  * @Author:    二胡子
  * @Date:      2022-09-06 20:02:01
  * @Wechat:    zhuda1024
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
-->

<template>
  <a-dropdown class="header-trigger" >
    <div class="wrapper">
      <ExclamationCircleOutlined />
      <span class="name">版本</span>
    </div>
    <template #overlay>
      <a-menu :class="['avatar-menu']">
        <a-menu-item >
          <span>当前版本: {{versionInfo.version }}</span>
        </a-menu-item>
        <a-menu-item >
          <span> 最后发布: {{versionInfo.buildTime }}</span>
        </a-menu-item>

      </a-menu>
    </template>
  </a-dropdown>

</template>
<script setup>
import { computed, ref, onMounted } from 'vue';
import { configApi } from '/src/api/system/config-api';
import { useUserStore } from '/@/store/modules/system/user';
import { useRouter } from 'vue-router';


// 头像背景颜色
const AVATAR_BACKGROUND_COLOR_ARRAY = ['#87d068', '#00B853', '#f56a00', '#1890ff'];

const versionInfo = ref({})
// ------------------------ 个人中心 ------------------------
const router = useRouter();
function toAccount(menuId) {
  router.push({
    path: '/account',
    query: { menuId },
  });
}

// ------------------------ 修改密码 ------------------------
const resetPasswordRef = ref();

function showUpdatePwdModal() {
  resetPasswordRef.value.showModal();
}

// ------------------------ 以下是 头像和姓名 相关 ------------------------

const avatarName = ref('');
const avatar = computed(() => useUserStore().avatar);
const actualName = computed(() => useUserStore().actualName);

// 更新头像信息
function updateAvatar() {
  if (useUserStore().actualName) {
    avatarName.value = useUserStore().actualName.substr(0, 1);
    const avatar = document.getElementById('LightAdminAvatar');
    if (avatar) {
      avatar.style.backgroundColor = AVATAR_BACKGROUND_COLOR_ARRAY[hashcode(avatarName.value) % 4];
    }
  }
}

/**
 * 通过计算固定字符串的hash，来选择颜色，这也每次登录的颜色是相同的
 */
function hashcode(str) {
  let hash = 1,
      i,
      chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

onMounted(async()=>  {
  updateAvatar();
  let {data} =  await configApi.getVersion();
  versionInfo.value = data;
});
</script>
<style lang="less" scoped>
.wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;

  .avatar-image {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 50%;
  }
}

.header-trigger {
  height: @header-user-height;
  line-height: @header-user-height;

  .avatar {
    vertical-align: middle;
  }

  .name {
    margin-left: 5px;
    font-weight: 500;
  }
}
</style>
