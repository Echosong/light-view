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
      <a-form-item label="标题" prop="title" v-if="!query.title">
        <a-input v-model:value="m.title"></a-input>
      </a-form-item>
      <a-form-item label="封面图片" v-if="!query.imgUrl">
        <FileImage @onremove="m.imgUrl = ''" @onSuccess="m.imgUrl = $event" :file="m.imgUrl"/>
      </a-form-item>
      <a-form-item label="类型" v-if="!query.type">
        <input-enum enumName="articleTypeEnum" v-model:value="m.type"></input-enum>
      </a-form-item>
      <a-form-item label="内容" v-if="!query.content">
        <Wangeditor ref="content" :modelValue="m.content"></Wangeditor>
      </a-form-item>
      <a-form-item label="附件" v-if="!query.fileUrl">
        <File @onremove="m.fileUrl = ''" @onSuccess="m.fileUrl = $event" :file="m.fileUrl"/>
      </a-form-item>
      <a-form-item label="项目id" prop="projectId" v-if="!query.projectId">
        <a-input v-model:value="m.projectId"></a-input>
      </a-form-item>
      <a-form-item label="发布时间：" prop="publishTime" v-if="!query.publishTime">
        <a-date-picker v-model:value="m.publishTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                       placeholder="发布时间"></a-date-picker>
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
import Wangeditor from '/@/components/framework/wangeditor/index.vue';
import File from "/@/components/framework/base-upload-file/index.vue";

const content = ref()
const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {
  title: [],
  imgUrl: [],
  type: [],
  content: [],
  fileUrl: [],
  projectId: [],
  publishTime: [],
}
const ruleForm = ref();
const query = ref({});

async function open(data, parmas) {
  isShow.value = true;
  if (data) {
    title.value = "修改 新闻";
    let one = await base.get("/article/find/" + data.id);
    m.value = one.data;
    m.value = data;
  } else {
    let mdata = {
      title: '',
      imgUrl: '',
      type: 0,
      content: '',
      fileUrl: '',
      projectId: 0,
      publishTime: ''
    }
    query.value = parmas || {};
    m.value = {...mdata, ...parmas}
    title.value = "添加 新闻";
  }
}

//提交新闻信息
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();
    let contentText = content.value.getHtml()
    if (contentText) {
      m.value.content = contentText
    }

    base.post("/article/save", m.value).then(() => {
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