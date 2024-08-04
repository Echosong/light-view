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
      <a-form-item label="配置字段名" prop="key" v-if="!query.key">
        <a-input v-model:value="m.key"></a-input>
      </a-form-item>
      <a-form-item label="配置说明" prop="name" v-if="!query.name">
        <a-input v-model:value="m.name"></a-input>
      </a-form-item>
      <a-form-item label="配置分组" prop="group" v-if="!query.group">
        <a-input v-model:value="m.group"></a-input>
      </a-form-item>
      <a-form-item label="配置值" v-if="!query.value">
        <a-textarea rows="2" placeholder="配置值" v-model:value="m.value"></a-textarea>
      </a-form-item>
      <a-form-item label="类型" v-if="!query.type" tooltip="配置html展现类型">
        <input-enum enumName="htmlTypeEnum" v-model:value="m.type"></input-enum>
      </a-form-item>
      <a-form-item label="描述" prop="description" v-if="!query.description" tooltip="如果选择框用,隔开">
        <a-input v-model:value="m.description"></a-input>
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

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {
  key: [],
  name: [{min: 6, max: 16, message: '长度必须为6-16', trigger: 'blur'},],
  group: [{pattern: /^\d{0,}$/, message: '配置分组必须为数字类型', trigger: 'blur'},],
  value: [],
  type: [{pattern: /^\d{0,}$/, message: '类型必须为数字类型', trigger: 'blur'},],
  description: [],
}
const ruleForm = ref();
const query = ref({});

async function open(data, parmas) {
  isShow.value = true;
  if (data) {
    title.value = "修改 系统配置";
    let one = await base.get("/config/find/" + data.id);
    m.value = one.data;
    m.value = data;
  } else {
    let mdata = {
      key: '',
      name: '',
      group: 0,
      value: '',
      type: 0,
      description: ''
    }
    query.value = parmas || {};
    m.value = {...mdata, ...parmas}
    title.value = "添加 系统配置";
  }
}

//提交系统配置信息
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();

    base.post("/config/save", m.value).then(() => {
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