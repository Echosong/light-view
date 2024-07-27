<!--
  * 登录
  *
  * @Author:    1024创新实验室-主任：卓大
  * @Date:      2022-09-12 22:34:00
  * @Wechat:    zhuda1024
  * @Email:     lab1024@163.com
  * @Copyright  1024创新实验室 （ https://1024lab.net ），Since 2012
  *
-->
<template>
  <div class="login-container">
    <div class="box-item desc">
      <div class="welcome">
        <p>欢迎登录 LightAdmin V3</p>
        <p class="sub-welcome">「高质量代码、简洁、安全」的开发平台</p>
      </div>
      <img class="welcome-img" :src="leftBg2"/>
    </div>
    <div class="box-item login">
      <img class="login-qr" :src="loginQR"/>
      <div class="login-title">账号登录</div>
      <a-form ref="formRef" class="login-form" :model="loginForm" :rules="rules">
        <a-form-item name="loginName">
          <a-input v-model:value.trim="loginForm.username" placeholder="请输入用户名"/>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
              v-model:value="loginForm.password"
              autocomplete="on"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码：至少三种字符，最小 8 位"
          />
        </a-form-item>
        <a-form-item name="captchaCode">
          <a-input class="captcha-input" v-model:value.trim="loginForm.code" placeholder="请输入验证码"/>
          <img class="captcha-img" :src="captchaBase64Image" @click="getCaptcha"/>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="rememberPwd">记住密码</a-checkbox>
        </a-form-item>
        <a-form-item>
          <div class="btn" @click="onLogin">登录</div>
        </a-form-item>
      </a-form>

    </div>
  </div>
</template>
<script setup>
import {message} from 'ant-design-vue';
import {onMounted, onUnmounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {loginApi} from '/@/api/system/login-api';
import {SmartLoading} from '/@/components/framework/smart-loading';
import {LOGIN_DEVICE_ENUM} from '/@/constants/system/login-device-const';
import {useUserStore} from '/@/store/modules/system/user';
import loginQR from '/@/assets/images/login/login-qr.png';
import leftBg2 from '/@/assets/images/login/left-bg2.png';

import {buildRoutes} from '/@/router/index';
import {smartSentry} from '/@/lib/smart-sentry';
import {encryptByBase64} from '/@/lib/encrypt';
import {localSave} from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

//--------------------- 登录表单 ---------------------------------

const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  codeUid: '',
  loginDevice: LOGIN_DEVICE_ENUM.PC.value,
});
const rules = {
  username: [{required: true, message: '用户名不能为空'}],
  password: [{required: true, message: '密码不能为空'}],
  code: [{required: true, message: '验证码不能为空'}],
};

const showPassword = ref(false);
const router = useRouter();
const formRef = ref();
const rememberPwd = ref(false);

onMounted(() => {
  document.onkeyup = (e) => {
    if (e.keyCode == 13) {
      onLogin();
    }
  };
});

onUnmounted(() => {
  document.onkeyup = null;
});

//登录
async function onLogin() {
  formRef.value.validate().then(async () => {
    try {
      SmartLoading.show();

      let loginObj = JSON.parse(JSON.stringify(loginForm));
      // 密码加密
      loginObj.password = encryptByBase64(loginObj.password);
      const res = await loginApi.login(loginObj);


      stopRefrestCaptchaInterval();
      localSave(LocalStorageKeyConst.USER_TOKEN, res.data.tokenValue ? res.data.tokenValue : '');
      message.success('登录成功');
      //更新用户信息到pinia
      useUserStore().setUserLoginInfo(res.data);
      //构建系统的路由
      buildRoutes();
      router.push('/home');
    } catch (e) {
      if (e.data && e.data.code !== 200) {
        loginForm.code = '';
        getCaptcha();
      }
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  });
}

//--------------------- 验证码 ---------------------------------

const captchaBase64Image = ref('');

async function getCaptcha() {
  try {
    let captchaResult = await loginApi.getCaptcha();
    captchaBase64Image.value = captchaResult.data.code;
    loginForm.codeUid = captchaResult.data.codeUid;
  } catch (e) {
    console.log(e);
  }
}

let refrestCaptchaInterval = null;

function beginRefrestCaptchaInterval(expireSeconds) {
  if (refrestCaptchaInterval === null) {
    refrestCaptchaInterval = setInterval(getCaptcha, (expireSeconds - 5) * 1000);
  }
}

function stopRefrestCaptchaInterval() {
  if (refrestCaptchaInterval != null) {
    clearInterval(refrestCaptchaInterval);
    refrestCaptchaInterval = null;
  }
}

onMounted(getCaptcha);
</script>
<style lang="less" scoped>
@import './login.less';
</style>
