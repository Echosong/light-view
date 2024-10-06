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
            <a-form-item label="用户"  prop="username" v-if="!query.username" >
    <a-input v-model:value="m.username"></a-input>
</a-form-item>
<a-form-item label="日志类型" v-if="!query.logType" >
     <input-enum enumName="businessEnum" v-model:value="m.logType" ></input-enum>
</a-form-item>
<a-form-item label="请求ip"  prop="requestIp" v-if="!query.requestIp" >
    <a-input v-model:value="m.requestIp"></a-input>
</a-form-item>
<a-form-item label="地址"  prop="address" v-if="!query.address" >
    <a-input v-model:value="m.address"></a-input>
</a-form-item>
<a-form-item label="描述"  prop="description" v-if="!query.description" >
    <a-input v-model:value="m.description"></a-input>
</a-form-item>
<a-form-item label="客户端" v-if="!query.browser" >
<a-textarea   rows="2" placeholder="客户端"  v-model:value="m.browser"></a-textarea>
</a-form-item>
<a-form-item label="请求耗时"  prop="time" v-if="!query.time" >
    <a-input v-model:value="m.time"></a-input>
</a-form-item>
<a-form-item label="方法名"  prop="method" v-if="!query.method" >
    <a-input v-model:value="m.method"></a-input>
</a-form-item>
<a-form-item label="参数" v-if="!query.params" >
<a-textarea   rows="2" placeholder="参数"  v-model:value="m.params"></a-textarea>
</a-form-item>
<a-form-item label="请求路径"  prop="urlPath" v-if="!query.urlPath" >
    <a-input v-model:value="m.urlPath"></a-input>
</a-form-item>
<a-form-item label="状态" v-if="!query.state" >
     <input-enum enumName="yesOrNoEnum" v-model:value="m.state" ></input-enum>
</a-form-item>
<a-form-item label="异常详情" v-if="!query.exceptionDetail" >
<a-textarea   rows="2" placeholder="异常详情"  v-model:value="m.exceptionDetail"></a-textarea>
</a-form-item>
        </a-form>
        <template #footer>
            <a-space>
                <a-button @click="isShow= false">取消</a-button>
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
const rules = {username:[],
logType:[],
requestIp:[],
address:[],
description:[],
browser:[],
time:[],
method:[],
params:[],
urlPath:[],
state:[],
exceptionDetail:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "查看日志";
        let one = await base.get("/log/find/"+data.id);
        m.value = one.data;
    } else {
        let mdata  = {username:'',
logType:0,
requestIp:'',
address:'',
description:'',
browser:'',
time:0,
method:'',
params:'',
urlPath:'',
state:0,
exceptionDetail:''}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 日志";
    }
}

//提交日志信息
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
    open
})

</script>