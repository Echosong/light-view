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
            <a-form-item label="用户id"  prop="userId" v-if="!query.userId" >
    <a-input v-model:value="m.userId"></a-input>
</a-form-item>
<a-form-item label="用户账号"  prop="userAccount" v-if="!query.userAccount" >
    <a-input v-model:value="m.userAccount"></a-input>
</a-form-item>
<a-form-item label="图片" v-if="!query.images" >
 <FileImage :key="m.images" @onremove="m.images = ''" @onSuccess="m.images = $event" :file="m.images" />
</a-form-item>
<a-form-item label="内容"  prop="content" v-if="!query.content" >
    <a-input v-model:value="m.content"></a-input>
</a-form-item>
<a-form-item label="联系方式"  prop="contact" v-if="!query.contact" >
    <a-input v-model:value="m.contact"></a-input>
</a-form-item>
<a-form-item label="是否已读"  prop="isRead" v-if="!query.isRead" >
    <a-input v-model:value="m.isRead"></a-input>
</a-form-item>
<a-form-item label="意见反馈问题分类" v-if="!query.category" >
     <input-enum enumName="feedbackCategoryEnum" v-model:value="m.category" ></input-enum>
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

const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {userId:[],
userAccount:[],
images:[],
content:[],
contact:[],
isRead:[],
category:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 意见反馈";
        let one = await base.get("/feedback/find/"+data.id);
        m.value = one.data;
    } else {
        let mdata  = {userId:0,
userAccount:'',
images:'',
content:'',
contact:'',
isRead:0,
category:0}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 意见反馈";
    }
}

//提交意见反馈信息
async function onSubmit() {
    try {
        await ruleForm.value.validateFields();
        
        base.post("/feedback/save", m.value).then(() => {
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