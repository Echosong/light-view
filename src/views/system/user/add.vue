<template>
  <a-drawer
      :title="title"
      :width="700"
      :open="isShow"
      :body-style="{ paddingBottom: '80px' }"
      @close="isShow = false"
      destroyOnClose
  >
    <a-form v-if="m" ref="ruleForm" :rules="rules" :model="m" :label-col="{ span: 4 }">
      <a-form-item label="账号" prop="username" v-if="!query.username">
        <a-input v-model:value="m.username"></a-input>
      </a-form-item>
      <a-form-item label="手机号" prop="mobile" v-if="!query.mobile">
        <a-input v-model:value="m.mobile"></a-input>
      </a-form-item>
      <a-form-item label="密码" prop="password" v-if="!m.id">
        <a-input v-model:value="m.password"></a-input>
      </a-form-item>
      <a-form-item label="性别" v-if="!query.sex">
        <input-enum enumName="userSexEnum" v-model:value="m.sex"></input-enum>
      </a-form-item>
      <a-form-item label="工号" prop="code" v-if="!query.code">
        <a-input v-model:value="m.code"></a-input>
      </a-form-item>
      <a-form-item label="姓名" prop="name" v-if="!query.name">
        <a-input v-model:value="m.name"></a-input>
      </a-form-item>

      <a-form-item label="角色" prop="roleId" v-if="!query.roleId">
        <select-data v-model:value="m.roleId" routeName="role"></select-data>
      </a-form-item>

      <a-form-item label="状态" prop="margin" v-if="!query.margin">
        <input-enum v-model:value="m.state" enumName="UserStateEnum"></input-enum>
      </a-form-item>

      <a-form-item label="邮箱" prop="email" v-if="!query.email">
        <a-input v-model:value="m.email"></a-input>
      </a-form-item>
      <a-form-item label="注册ip" prop="regIp" v-if="!query.regIp">
        <a-input v-model:value="m.regIp"></a-input>
      </a-form-item>
      <a-form-item label="登录ip" prop="loginIp" v-if="!query.loginIp">
        <a-input v-model:value="m.loginIp"></a-input>
      </a-form-item>
      <a-form-item label="个人简介" v-if="!query.info">
        <a-textarea rows="2" placeholder="个人简介" v-model:value="m.info"></a-textarea>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button @click="isShow= false">取消</a-button>
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>
import {ref} from "vue";
import {base} from "/@/utils/base"
import InputEnum from "/@/components/framework/base-enum/index.vue";
import SelectData from '/@/components/framework/base-map/index.vue'

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {
  username: [],
  mobile: [],
  password: [{min: 6, max: 2147483647, message: '密码必须大于等于6位', trigger: 'blur'},],
  sex: [{pattern: /^\d{0,}$/, message: '性别必须为数字类型', trigger: 'blur'},],
  code: [],
  name: [{min: 2, max: 2147483647, message: '姓名必须大于两个字符', trigger: 'blur'},],
  state: [],
  email: [],
  regIp: [],
  loginIp: [],
  info: [],
}
const ruleForm = ref();
const query = ref({});

async function open(data, parmas) {
  isShow.value = true;
  if (data) {
    title.value = "修改 用户";
    let one = await base.get("/user/find/" + data.id);
    m.value = one.data;
    m.value = data;
  } else {
    let mdata = {
      username: '',
      mobile: '',
      password: '',
      sex: 0,
      code: '',
      name: '',
      state: 0,
      email: '',
      regIp: '',
      loginIp: '',
      info: ''
    }
    query.value = parmas || {};
    m.value = {...mdata, ...parmas}
    title.value = "添加 用户";
  }
}

//提交用户信息
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();

    base.post("/user/save", m.value).then(() => {
      emits('reloadList');
      isShow.value = false;
    });
  } catch (err) {
    base.error('参数验证错误，请仔细填写表单数据!' + err.message);
  }
}

defineExpose({
  open
})

</script>