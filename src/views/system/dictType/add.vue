<template>
    <a-drawer
        :title="title"
        :width="600"
        :open="isShow"
        :body-style="{ paddingBottom: '80px' }"
        @close="isShow = false"
        destroyOnClose
    >
        <a-form v-if="m" ref="ruleForm" :rules="rules" :model="m" :label-col="{ span: 3 }"
                 label-width="120px">
            <a-form-item label="字典名称"  prop="dictName" v-if="!query.dictName" >
    <a-input v-model:value="m.dictName"></a-input>
</a-form-item>
<a-form-item label="字典编码"  prop="dictCode" v-if="!query.dictCode" >
    <a-input v-model:value="m.dictCode"></a-input>
</a-form-item>
<a-form-item label="字典类型"  prop="dictType" v-if="!query.dictType" >
    <a-input v-model:value="m.dictType"></a-input>
</a-form-item>
<a-form-item label="分组"  prop="groupName" v-if="!query.groupName" >
    <a-input v-model:value="m.groupName"></a-input>
</a-form-item>
<a-form-item label="状态" v-if="!query.state" tooltip="1=正常,0=停用">
     <input-enum enumName="dicTypeStateEnum" v-model:value="m.state" ></input-enum>
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
import InputEnum from "@/components/enum/InputEnum.vue";

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {dictName:[],
dictCode:[],
dictType:[],
groupName:[],
state:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 字典类型";
        let one = await base.get("/dictType/find/"+data.id);
        m.value = one.data;
        m.value = data;
    } else {
        let mdata  = {dictName:'',
dictCode:'',
dictType:'',
groupName:'',
state:0}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 字典类型";
    }
}

//提交字典类型信息
async function onSubmit() {
    try {
        await ruleForm.value.validateFields();
        base.post("/dictType/save", m.value).then(() => {
            emits('reloadList');
            isShow.value = false;
        });
    } catch (err) {
        base.error('参数验证错误，请仔细填写表单数据!'+ err.message);
    }
}

defineExpose({
    open
})

</script>