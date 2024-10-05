<template>
  <a-drawer
      :title="title"
      :width="700"
      :open="isShow"
      :body-style="{ paddingBottom: '80px' }"
      @close="isShow = false"
      destroyOnClose
  >
    <a-form v-if="m" ref="ruleForm" :rules="rules" :model="m" :label-col="{ span: 3 }">
      <a-form-item label="位置" v-if="!query.position">
        <input-enum enumName="adPositionEnum" v-model:value="m.position"></input-enum>
      </a-form-item>
      <a-form-item label="名称" prop="name" v-if="!query.name">
        <a-input v-model:value="m.name"></a-input>
      </a-form-item>
      <a-form-item label="关联代码" prop="relationCode" v-if="!query.relationCode">
        <a-input v-model:value="m.relationCode"></a-input>
      </a-form-item>
      <a-form-item label="图片" v-if="!query.image">
        <FileImage @onremove="m.image = ''" @onSuccess="m.image = $event" :file="m.image"/>
      </a-form-item>
      <a-form-item label="跳转位置" prop="url" v-if="!query.url">
        <a-input v-model:value="m.url"></a-input>
      </a-form-item>
      <a-form-item label="状态" v-if="!query.state">
        <input-enum enumName="yesOrNoEnum" v-model:value="m.state"></input-enum>
      </a-form-item>
      <a-form-item label="关联的实体" v-if="!query.info">
        <a-textarea rows="2" placeholder="关联的实体" v-model:value="m.info"></a-textarea>
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
import FileImage from "/@/components/framework/base-upload-image/index.vue";

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {
  position: [],
  name: [],
  relationCode: [],
  image: [],
  url: [],
  state: [],
  info: [],
}
const ruleForm = ref();
const query = ref({});

async function open(data, parmas) {
  isShow.value = true;
  if (data) {
    title.value = "修改 广告管理";
    let one = await base.get("/ad/find/" + data.id);
    m.value = one.data;
    m.value = data;
  } else {
    let mdata = {
      position: 0,
      name: '',
      relationCode: '',
      image: '',
      url: '',
      state: 0,
      info: ''
    }
    query.value = parmas || {};
    m.value = {...mdata, ...parmas}
    title.value = "添加 广告管理";
  }
}

//提交广告管理信息
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();

    base.post("/ad/save", m.value).then(() => {
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