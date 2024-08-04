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
      <a-form-item label="图标" v-if="!query.ico">
        <FileImage @onremove="m.ico = ''" @onSuccess="m.ico = $event" :file="m.ico"/>
      </a-form-item>
      <a-form-item label="文件名" v-if="!query.fileName">
        <File @onremove="m.fileName = ''" @onSuccess="m.fileName = $event" :file="m.fileName"/>
      </a-form-item>
      <a-form-item label="文件扩展名" prop="extend" v-if="!query.extend">
        <a-input v-model:value="m.extend"></a-input>
      </a-form-item>
      <a-form-item label="文件存储路径" prop="filePath" v-if="!query.filePath">
        <a-input v-model:value="m.filePath"></a-input>
      </a-form-item>
      <a-form-item label="文件类型" v-if="!query.fileType">
        <input-enum enumName="fileTypeEnum" v-model:value="m.fileType"></input-enum>
      </a-form-item>
      <a-form-item label="文件大小" prop="fileSize" v-if="!query.fileSize">
        <a-input v-model:value="m.fileSize"></a-input>
      </a-form-item>
      <a-form-item label="相对路径" prop="urlPath" v-if="!query.urlPath">
        <a-input v-model:value="m.urlPath"></a-input>
      </a-form-item>
      <a-form-item label="文件唯一标识" prop="uuid" v-if="!query.uuid">
        <a-input v-model:value="m.uuid"></a-input>
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
import FileImage from "/@/components/framework/base-upload-image/index.vue";
import InputEnum from "/@/components/framework/base-enum/index.vue";
import File from "/@/components/framework/base-upload-file/index.vue";

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {
  ico: [],
  fileName: [],
  extend: [],
  filePath: [],
  fileType: [],
  fileSize: [],
  urlPath: [],
  uuid: [],
}
const ruleForm = ref();
const query = ref({});

async function open(data, parmas) {
  isShow.value = true;
  if (data) {
    title.value = "修改 文件管理";
    m.value = data;
  } else {
    let mdata = {
      ico: '',
      fileName: '',
      extend: '',
      filePath: '',
      fileType: 0,
      fileSize: 0,
      urlPath: '',
      uuid: ''
    }
    query.value = parmas || {};
    m.value = {...mdata, ...parmas}
    title.value = "添加 文件管理";
  }
}

//提交文件管理信息
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();
    base.post("/file/save", m.value).then(() => {
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