<template>
  <a-select
      v-model:value="changeValue"
      show-search
      placeholder="请选择"
      :options="options"
      :filter-option="filterOption"
      allowClear
      @change="selectTo"
  ></a-select>
</template>
<script setup>
import {ref} from "@vue/runtime-core";
import {onMounted, watch} from "vue";
import {base} from "/@/utils/base";

const changeValue = ref()
const options = ref([])
const props = defineProps({
  enumName: {type: String, default: ""},
  modelValue: {type: Number, default: null },
  hasDefault: {type: Boolean, default: true}
})

onMounted(async () => {
  const {data} = await base.get("/getEnums?enumName=" + props.enumName);
  data.forEach(item => {
    options.value.push({
      value: parseInt( item.code),
      label: item.name
    })
  })
  changeValue.value = props.modelValue;
})

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const emits = defineEmits(['update:modelValue'])

function selectTo() {
  emits('update:modelValue', changeValue.value);
}

</script>