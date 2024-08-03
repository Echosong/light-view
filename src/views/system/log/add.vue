
<template>
  <a-modal
      :title="title"
      width="600px"
      :open="isShow"
      @cancel="isShow = false"
      :maskClosable="false"
      :destroyOnClose="true"
      forceRender
  >
    <a-form ref="ruleForm" :model="m" :rules="rules" :label-col="{ span: 3 }">
      <a-form-item label="用户名称" name="positionName">
        <a-input style="width: 100%" v-model:value="m.username" placeholder="用户"/>
      </a-form-item>
      <a-form-item label="请求id" name="level">
        <a-input style="width: 100%" v-model:value="m.requestIp" placeholder="请求ip"/>
      </a-form-item>
      <a-form-item label="方法名" name="sort">
        <a-input-number :min="0" :step="1" :precision="0" style="width: 100%" v-model:value="m.method"
                        placeholder="排序"/>
      </a-form-item>
      <a-form-item label="参数" name="params">
        <a-textarea  style="width: 100%" v-model:value="m.params" placeholder="参数"/>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="isShow= false">取消</a-button>
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script setup>
import {ref} from 'vue';
import {base} from "/@/utils/base"

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
// ------------------------ 显示与隐藏 ------------------------
// 是否显示
const isShow = ref(false);
const  title = ref("");

async function open(data, parmas) {
  isShow.value = true;
  if (data) {
    title.value = "修改 日志";
    let one = await base.get("/log/find/" + data.id);
    m.value = one.data;
    m.value = data;
  } else {
    m.value = {};
    title.value = "添加日志";
  }
}


// ------------------------ 表单 ------------------------

// 组件ref
const ruleForm = ref();
const m = ref({});

const rules = {
  username: [{required: true, message: '请输入用户名'}],
};

// 点击确定，验证表单
async function onSubmit() {
  try {
    await ruleForm.value.validateFields();
    base.post("/log/save", m.value).then(() => {
      emits('reloadList');
      isShow.value = false;
    });
  } catch (err) {
    base.error('参数验证错误，请仔细填写表单数据!'+ err.message);
  }
}


defineExpose({
  open,
});
</script>
