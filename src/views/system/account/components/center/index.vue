<template>
  <div class="center-container">
    <!--  页面标题-->
    <div class="header-title">个人中心</div>

    <!--  内容区域-->
    <div class="center-form-area">
      <a-row>
        <a-col flex="350px">
          <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
            <a-form-item label="登录账号" name="username">
              <a-input class="form-item" v-model:value.trim="form.username" placeholder="请输入登录账号" disabled />
            </a-form-item>
            <a-form-item label="员工名称" name="name">
              <a-input class="form-item" v-model:value.trim="form.name" placeholder="请输入员工名称" />
            </a-form-item>
            <a-form-item label="性别" name="sex">
              <smart-enum-select class="form-item" v-model="form.sex" placeholder="请选择性别" enum-name="UserSexEnum" />
            </a-form-item>
            <a-form-item label="手机号码" name="phone">
              <a-input class="form-item" disabled v-model:value.trim="form.mobile" placeholder="请输入手机号码" />
            </a-form-item>

            <a-form-item label="邮箱" name="phone">
              <a-input class="form-item" disabled v-model:value.trim="form.email" placeholder="请输入邮箱" />
            </a-form-item>

            <a-form-item label="部门" name="departmentId">
              <a-input class="form-item" disabled v-model:value="form.roleName" placeholder="请选择部门" />
            </a-form-item>
            <a-form-item label="备注" name="info">
              <a-textarea class="form-item" v-model:value="form.info" placeholder="请输入备注" :rows="4" />
            </a-form-item>
          </a-form>
          <a-button type="primary" @click="onSubmit">更新个人信息</a-button>
        </a-col>

      </a-row>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { regular } from '/@/constants/regular-const.js';
  import SmartEnumSelect from '/@/components/framework/base-enum/index.vue';
  import { loginApi } from '/@/api/system/login-api.js';
  import { useUserStore } from '/@/store/modules/system/user.js';
  import { message } from 'ant-design-vue';
  import { smartSentry } from '/@/lib/smart-sentry.js';
  import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
  import {base} from "/@/utils/base.js";

  // 组件ref
  const formRef = ref();

  const formDefault = {
    // 员工ID
    id: undefined,
    // 头像
    avatar: undefined,
    // 登录账号
    username: '',
    // 员工名称
    name: '',
    // 性别
    gender: undefined,
    // 手机号码
    mobile: '',
    // 部门id
    roleId: undefined,
    // 是否启用
    state: undefined,
    // 备注
    info: '',
  };
  let form = ref({ ...formDefault });
  const rules = {
    name: [
      { required: true, message: '姓名不能为空' },
      { max: 30, message: '姓名不能大于30个字符', trigger: 'blur' },
    ],
    mobile: [
      { required: true, message: '手机号不能为空' },
      { pattern: regular.phone, message: '请输入正确的手机号码', trigger: 'blur' },
    ],
    sex: [{ required: true, message: '性别不能为空' }],
  };

  // 查询登录信息
  async function getLoginInfo() {
    try {
      //获取登录用户信息
      const res = await loginApi.getLoginInfo();
      let data = res.data;
      //更新用户信息到pinia
      useUserStore().setUserLoginInfo(data);
      // 当前form展示
      form.value = data;
    } catch (e) {
      smartSentry.captureError(e);
    }
  }


  // 更新员工信息
  async function updateEmployee() {
    SmartLoading.show();
    try {
      await base.post("/user/currentUpdate", form.value);
      message.success('更新成功');
      // 重新获取详情，刷新整体缓存
      await getLoginInfo();
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }

  // 表单提交
  function onSubmit() {
    formRef.value
      .validate()
      .then(() => {
        updateEmployee();
      })
      .catch((error) => {
        console.log('error', error);
        message.error('参数验证错误，请仔细填写表单数据!');
      });
  }

  onMounted(() => {
    getLoginInfo();
  });
</script>
<style lang="less" scoped>
  .center-container {
    .header-title {
      font-size: 20px;
    }

    .center-form-area {
      margin-top: 20px;

      .avatar-container {
        position: relative;
        border-radius: 50%;
        overflow: hidden;
        width: 100%;
        height: 100%;

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          font-size: 17px;
        }

        &:hover .overlay {
          opacity: 1; /* 鼠标悬停时显示蒙版 */
        }
      }

      .avatar-uploader {
        :deep(.ant-upload) {
          border-radius: 50%;
          width: 150px;
          height: 150px;
        }
      }

      .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
      }

      .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    }
  }
</style>
