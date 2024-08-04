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
            <a-form-item label="消息类型" v-if="!query.type" >
     <input-enum enumName="templateTypeEnum" v-model:value="m.type" ></input-enum>
</a-form-item>
<a-form-item label="消息模板编码"  prop="templateCode" v-if="!query.templateCode" >
    <a-input v-model:value="m.templateCode"></a-input>
</a-form-item>
<a-form-item label="消息接收者"  prop="receiverId" v-if="!query.receiverId" >
    <a-input v-model:value="m.receiverId"></a-input>
</a-form-item>
<a-form-item label="消息接收者账号"  prop="receiverAccount" v-if="!query.receiverAccount" >
    <a-input v-model:value="m.receiverAccount"></a-input>
</a-form-item>
<a-form-item label="消息发送者"  prop="senderId" v-if="!query.senderId" >
    <a-input v-model:value="m.senderId"></a-input>
</a-form-item>
<a-form-item label="消息发送者账号"  prop="senderAccount" v-if="!query.senderAccount" >
    <a-input v-model:value="m.senderAccount"></a-input>
</a-form-item>
<a-form-item label="状态" v-if="!query.state" >
     <input-enum enumName="messageStateEnum" v-model:value="m.state" ></input-enum>
</a-form-item>
<a-form-item label="消息参数"  prop="params" v-if="!query.params" >
    <a-input v-model:value="m.params"></a-input>
</a-form-item>
<a-form-item label="消息内容" v-if="!query.message" >
<a-textarea   rows="2" placeholder="消息内容"  v-model:value="m.message"></a-textarea>
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
const rules = {type:[],
templateCode:[],
receiverId:[],
receiverAccount:[],
senderId:[],
senderAccount:[],
state:[],
params:[],
message:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 站内消息、短息 记录";
        let one = await base.get("/message/find/"+data.id);
        m.value = one.data;
        m.value = data;
    } else {
        let mdata  = {type:0,
templateCode:'',
receiverId:0,
receiverAccount:'',
senderId:0,
senderAccount:'',
state:0,
params:'',
message:''}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 站内消息、短息 记录";
    }
}

//提交站内消息、短息 记录信息
async function onSubmit() {
    try {
        await ruleForm.value.validateFields();
        
        base.post("/message/save", m.value).then(() => {
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