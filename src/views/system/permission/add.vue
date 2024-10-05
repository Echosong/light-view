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
      <a-form-item label="权限名称" prop="name" v-if="!query.name">
        <a-input v-model:value="m.name"></a-input>
      </a-form-item>
      <a-form-item label="权限描述" prop="description" v-if="!query.description">
        <a-input v-model:value="m.description"></a-input>
      </a-form-item>
      <a-form-item label="权限标识" prop="perms" v-if="!query.perms">
        <a-input v-model:value="m.perms"></a-input>
      </a-form-item>
      <a-form-item label="组件" prop="component" v-if="!query.component">
        <a-input v-model:value="m.component"></a-input>
      </a-form-item>
      <a-form-item label="排序" prop="sort" v-if="!query.sort">
        <a-input v-model:value="m.sort"></a-input>
      </a-form-item>
      <a-form-item label="图标" prop="icon" v-if="!query.icon">
        <a-input v-model:value="m.icon"></a-input>
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


const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {
  name: [],
  description: [],
  url: [],
  perms: [],
  component: [],
  parentId: [{pattern: /^\d{0,}$/, message: '父级id必须为数字类型', trigger: 'blur'},],
  type: [{pattern: /^\d{0,}$/, message: '类型必须为数字类型', trigger: 'blur'},],
  sort: [],
  icon: [],
  show: [],
}
const ruleForm = ref();
const query = ref({});

async function open(data, parmas) {
  isShow.value = true;
  if (data.id) {
    title.value = "修改 权限";
    m.value = data;
  } else {
    let mdata = {
      name: '',
      description: '',
      url: '',
      perms: '',
      component: '',
      parentId: data.parentId || 0,
      type: data.type,
      sort: 0,
      icon: '',
      show: 1
    }
    query.value = parmas || {};
    m.value = {...mdata, ...parmas}
    if(data.parentId){
      title.value = "添加 "+ data.parentName + " 的下级"
    }else{
      title.value = "添加顶级权限";
    }
  }
}

//提交权限信息
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();
    base.post("/permission/save", m.value).then(() => {
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