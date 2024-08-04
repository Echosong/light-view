<template>
    <Dialog v-model="isShow" :title="title" maxHeight="700px">
        <el-form v-if="m" ref="ruleForm" :rules="rules" :model="m" class="demo-ruleForm"
                 label-width="120px">
            <el-form-item label="角色名称"  prop="name" v-if="!query.name" >
    <el-input v-model="m.name"></el-input>
</el-form-item>
<el-form-item label="角色编码"  prop="code" v-if="!query.code" >
    <el-input v-model="m.code"></el-input>
</el-form-item>
<el-form-item label="描述"  prop="description" v-if="!query.description" >
    <el-input v-model="m.description"></el-input>
</el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="ok($parent)">
                    确定
                </el-button>
                <el-button @click="isShow = false">取消</el-button>
            </span>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from "@/components/dialog/index.vue";
import {inject, ref} from "vue";


const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {name:[],
code:[],
description:[],
}
const sa = inject('sa')
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 所属角色";
        let one = await sa.get("/role/find/"+data.id);
        m.value = one.data;
        m.value = data;
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
function ok(parent) {
    ruleForm.value.validate(async (valid) => {
        if (valid) {
            
            await sa.post("/role/save", m.value);
            parent.f5();
            isShow.value = false;
        } else {
            console.log("error submit!!");
            return false;
        }
    });
}

defineExpose({
    open
})

</script>