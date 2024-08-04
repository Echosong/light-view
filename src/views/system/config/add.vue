<template>
    <Dialog v-model="isShow" :title="title" maxHeight="700px">
        <el-form v-if="m" ref="ruleForm" :rules="rules" :model="m" class="demo-ruleForm"
                 label-width="120px">
            <el-form-item label="配置字段名"  prop="key" v-if="!query.key" >
    <el-input v-model="m.key"></el-input>
</el-form-item>
<el-form-item label="配置说明"  prop="name" v-if="!query.name" >
    <el-input v-model="m.name"></el-input>
</el-form-item>
<el-form-item label="配置分组"  prop="group" v-if="!query.group" >
    <el-input v-model="m.group"></el-input>
</el-form-item>
<el-form-item label="配置值"  prop="value" v-if="!query.value" >
    <el-input v-model="m.value"></el-input>
</el-form-item>
    <el-tooltip class="item" effect="dark" content="配置html展现类型" placement="top-start">
     <el-form-item label="类型" v-if="!query.type">
     <input-enum enumName="htmlTypeEnum" v-model="m.type" ></input-enum>
</el-form-item>
    </el-tooltip>

    <el-tooltip class="item" effect="dark" content="如果选择框用,隔开" placement="top-start">
     <el-form-item label="描述"  prop="description" v-if="!query.description" >
    <el-input v-model="m.description"></el-input>
</el-form-item>
    </el-tooltip>

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
import InputEnum from "@/components/enum/InputEnum.vue";

const props = defineProps(["params"]);
const m = ref({});
const title = ref("");
const isShow = ref(false);
const rules = {key:[],
name:[{ min: 6, max: 16, message: '长度必须为6-16', trigger: 'blur' },],
group:[{pattern:/^\d{0,}$/, message:'配置分组必须为数字类型', trigger: 'blur'},],
value:[],
type:[{pattern:/^\d{0,}$/, message:'类型必须为数字类型', trigger: 'blur'},],
description:[],
}
const sa = inject('sa')
const ruleForm = ref();
const  query = ref({});

async function open(data, parmas)  {
    isShow.value = true;
    if (data) {
        title.value = "修改 系统配置";
        let one = await sa.get("/config/find/"+data.id);
        m.value = one.data;
        m.value = data;
    } else {
        let mdata  = {key:'',
name:'',
group:0,
value:'',
type:0,
description:''}
        query.value = parmas || {};
        m.value ={...mdata, ...parmas}
        title.value = "添加 系统配置";
    }
}

//提交系统配置信息
function ok(parent) {
    ruleForm.value.validate(async (valid) => {
        if (valid) {
            
            await sa.post("/config/save", m.value);
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