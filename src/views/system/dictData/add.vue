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
            <a-form-item label="类型id"  prop="typeId" v-if="!query.typeId" >
    <a-input v-model:value="m.typeId"></a-input>
</a-form-item>
<a-form-item label="字典键"  prop="dictKey" v-if="!query.dictKey" >
    <a-input v-model:value="m.dictKey"></a-input>
</a-form-item>
<a-form-item label="字典键值" v-if="!query.dictValue" >
<a-textarea   rows="2" placeholder="字典键值"  v-model:value="m.dictValue"></a-textarea>
</a-form-item>
<a-form-item label="字典排序"  prop="dictSort" v-if="!query.dictSort" >
    <a-input v-model:value="m.dictSort"></a-input>
</a-form-item>
<a-form-item label="字典描述"  prop="dictLabel" v-if="!query.dictLabel" >
    <a-input v-model:value="m.dictLabel"></a-input>
</a-form-item>
<a-form-item label="字典类型"  prop="dictType" v-if="!query.dictType" >
    <a-input v-model:value="m.dictType"></a-input>
</a-form-item>
<a-form-item label="样式属性"  prop="cssClass" v-if="!query.cssClass" >
    <a-input v-model:value="m.cssClass"></a-input>
</a-form-item>
<a-form-item label="表格字典样式"  prop="listClass" v-if="!query.listClass" >
    <a-input v-model:value="m.listClass"></a-input>
</a-form-item>
<a-form-item label="状态" v-if="!query.status" tooltip="1=正常,0=停用">
     <input-enum enumName="dicTypeStateEnum" v-model:value="m.status" ></input-enum>
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
const rules = {typeId:[],
dictKey:[],
dictValue:[],
dictSort:[],
dictLabel:[],
dictType:[],
cssClass:[],
listClass:[],
status:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 字典数据";
        let one = await base.get("/dictData/find/"+data.id);
        m.value = one.data;
        m.value = data;
    } else {
        let mdata  = {typeId:0,
dictKey:0,
dictValue:'',
dictSort:0,
dictLabel:'',
dictType:'',
cssClass:'',
listClass:'',
status:0}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 字典数据";
    }
}

//提交字典数据信息
async function onSubmit() {
    try {
        await ruleForm.value.validateFields();
        base.post("/dictData/save", m.value).then(() => {
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