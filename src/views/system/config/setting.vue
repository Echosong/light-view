<template>
  <a-card size="small" :bordered="false" :hoverable="true" style="padding-left: 20px; ">
    <a-tabs v-model:activeKey="activeName" class="smart-query-form">
      <a-tab-pane :key="index" :tab="key" v-for="(value, key, index) in configObj">
        <a-form v-if="m" ref="ruleForm" :rules="rules" :model="m" :label-col="{ span: 4 }">
          <template v-for="(item, idx) in value">
            <a-form-item :label="item.name" :tooltip="item.description" style="width: 80%;">
              <a-input v-if="item.type === 0" v-model:value="item.value"></a-input>
              <a-select v-if="item.type === 1" v-model:value="item.value">
                <a-select-option value="0">请选择</a-select-option>
                <a-select-option v-for="op in item.options" :key="op.v" :value="op.v">{{ op.n }}</a-select-option>
              </a-select>
              <ESwitch v-if="item.type === 2" v-model:value="item.value" size="default"></ESwitch>
              <template v-if="item.type === 3">
                <a-checkbox-group v-model:value="item.value">
                  <a-checkbox v-for="op in item.options" :key="op.v" :value="op.v">{{ op.n }}
                  </a-checkbox>
                </a-checkbox-group>
              </template>
              <FileImage v-if="item.type === 4" @onremove="item.value = ''" @onSuccess="item.value = $event" :file="item.value"/>

              <a-textarea v-if="item.type === 5" v-model:value="item.value"></a-textarea>

              <File v-if="item.type === 6" @onremove="item.value = ''"  @onSuccess="item.value = $event" :file="item.value"/>

              <Wangeditor ref="content" v-if="item.type === 7" v-model="item.value"></Wangeditor>
              <ConfigTable v-model="item.value" v-if="item.type === 8"/>
            </a-form-item>
          </template>
        </a-form>
      </a-tab-pane>
    </a-tabs>

    <a-flex justify="center" align="center" style="width: 1000px;">
      <a-space>
        <a-button type="primary" @click="onSubmit">修改配置</a-button>
      </a-space>
    </a-flex>
  </a-card>

</template>

<script setup>
import {onMounted, ref} from "vue";
import {base} from "/@/utils/base"
import ESwitch from "/@/components/framework/base-switch/index.vue";
import {configApi} from "/@/api/system/config-api.js";
import Wangeditor from "/@/components/framework/wangeditor/index.vue";
import FileImage from "/@/components/framework/base-upload-image/index.vue";
import File from "/@/components/framework/base-upload-file/index.vue";
import ConfigTable from "/@/views/system/config/configTable.vue";

const m = ref({});
const activeName = ref(0)
const name = ref("系统配置");
const configObj = ref({})
const ruleForm = ref();


const rules = {}


onMounted(() => {
  init()
})

const init = async () => {
  const {data} = await configApi.getConfigList({});
  configObj.value = data;
}


//提交系统配置信息
async function onSubmit() {
  let configList = [];
  let configs = configObj.value;
  for (let configObjKey in configs) {
    configList = configList.concat(configs[configObjKey])
  }
  await configApi.saveConfigList(configList);
  base.success("修改配置成功！！")
}


</script>