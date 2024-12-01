<template>
    <a-drawer
        :title="title"
        :width="700"
        :open="isShow"
        :body-style="{ paddingBottom: '80px' }"
        @close="isShow = false"
        destroyOnClose
    >
        <a-form v-if="m" ref="ruleForm" :rules="rules" :model="m" :label-col="{ span: 4 }" >
            <a-form-item label="父级code"  prop="parentCode" v-if="!query.parentCode" >
    <a-input v-model:value="m.parentCode"></a-input>
</a-form-item>
<a-form-item label="省市区县名"  prop="areaName" v-if="!query.areaName" >
    <a-input v-model:value="m.areaName"></a-input>
</a-form-item>
<a-form-item label="省市区县"  prop="areaCode" v-if="!query.areaCode" >
    <a-input v-model:value="m.areaCode"></a-input>
</a-form-item>
<a-form-item label="状态" v-if="!query.status" >
     <input-enum enumName="adStateEnum" v-model:value="m.status" ></input-enum>
</a-form-item>
<a-form-item label="是否修改" v-if="!query.isAdd" >
     <input-enum enumName="yesOrNoEnum" v-model:value="m.isAdd" ></input-enum>
</a-form-item>
<a-form-item label="省市区" v-if="!query.type" >
     <input-enum enumName="areaTypeEnum" v-model:value="m.type" ></input-enum>
</a-form-item>
<a-form-item label="拼音"  prop="pinyin" v-if="!query.pinyin" >
    <a-input v-model:value="m.pinyin"></a-input>
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
const rules = {parentCode:[],
areaName:[],
areaCode:[],
status:[],
isAdd:[],
type:[],
pinyin:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 行政区划实体";
        let one = await base.get("/areaDj/find/"+data.id);
        m.value = one.data;
    } else {
        let mdata  = {parentCode:'',
areaName:'',
areaCode:'',
status:0,
isAdd:0,
type:0,
pinyin:''}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 行政区划实体";
    }
}

//提交行政区划实体信息
async function onSubmit() {
    try {
        await ruleForm.value.validateFields();
        
        base.post("/areaDj/save", m.value).then(() => {
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