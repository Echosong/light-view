<template>
    <a-drawer
        :title="title"
        :width="700"
        :open="isShow"
        :body-style="{ paddingBottom: '80px' }"
        @close="isShow = false"
        destroyOnClose
    >
        <a-form v-if="m" ref="ruleForm" :rules="rules" :model="m" :label-col="{ span: 3 }" >
            <a-form-item label="角色名称"  prop="name" v-if="!query.name" >
    <a-input v-model:value="m.name"></a-input>
</a-form-item>
<a-form-item label="角色编码"  prop="code" v-if="!query.code" >
    <a-input v-model:value="m.code"></a-input>
</a-form-item>
<a-form-item label="描述"  prop="description" v-if="!query.description" >
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


const emits = defineEmits(['reloadList']);
const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {name:[],
code:[],
description:[],
}
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 所属角色";
        let one = await base.get("/role/find/"+data.id);
        m.value = one.data;
    } else {
        let mdata  = {name:'',
code:'',
description:''}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 所属角色";
    }
}

//提交所属角色信息
async function onSubmit() {
    try {
        await ruleForm.value.validateFields();
        
        base.post("/role/save", m.value).then(() => {
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