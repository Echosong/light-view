

<template>
  <a-card size="small" :bordered="false" :hoverable="true">
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="add" size="small" type="primary">
          <template #icon>
            <PlusOutlined/>
          </template>
          添加
        </a-button>
      </div>
    </a-row>
    <a-table bordered :data-source="tableData" :columns="columns" size="small" :pagination="false">
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="!['image','action'].includes(column.dataIndex)">
          <a-input v-model:value="record[column.dataIndex]"  :placeholder="column.title"/>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="onDelete(index)"  danger type="link">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<style scoped lang="less">

</style>

<script setup>

import {watch, ref} from "vue";

const props = defineProps({
  modelValue: {type: String, default: ''},
})
const tableData = ref([])
const columns =[{
  title: '积分',
  dataIndex: 'name',
  ellipsis: true
}, {
  title: '抵扣金额',
  dataIndex: 'value',
  ellipsis: true

}, {
  title: '操作',
  width: 80,
  dataIndex: 'action',
  key: 'action',
}]

function init(){
  console.log("dddddddddd", props.modelValue)

  if (props.modelValue) {
    let values = props.modelValue.split(',');
    tableData.value = values.map(item => {
      let split = item.split(':');
      return {
        name: split[0],
        value: split[1]
      }
    })
  }else{
    tableData.value = [{name:'', value: ''}]
  }
  console.log("积分信息", tableData.value)
}
function add(){
  tableData.value.push({key: '', value: ''})
}
const onDelete = (index) => {
  tableData.value.splice(index, 1)
};

init();

const emit = defineEmits(['update:modelValue'])

watch(tableData.value, async (newVal, oldValue) => {
  let configValues = newVal.map(item => {if(item.name && item.value) return item.name + ':' + item.value }).join(',')
  console.log("积分信息==========", configValues)
  emit('update:modelValue', configValues);
})

</script>