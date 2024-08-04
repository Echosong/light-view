<template>
  <a-select
      v-model:value="changeValue"
      show-search
      placeholder="请选择"
      :options="options"
      :filter-option="filterOption"
      @change="selectTo"
      :disabled = "props.disabled"
  ></a-select>
</template>
<script setup>
import { ref } from "@vue/runtime-core";
import { onMounted } from "vue";
import {base} from "/@/utils/base";

const changeValue = ref(0)
const options = ref([])
const props = defineProps({
  indexId: { default: ''},
  routeName: {default: ""},
  type: {default: 0},
  disabled: {default: false}
})

onMounted(async () => {
  const {data} = await base.get("/"+props.routeName+"/getMap?type="+props.type);
  data.forEach(item => {
    options.value.push({
      value: item.code,
      label: item.name
    })
  })
  changeValue.value = parseInt(props.modelValue || 10000);
})

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const emits = defineEmits(['update:modelValue'])

function selectTo() {
  let selectValue = changeValue.value === 10000 ? null : changeValue.value;
  emits('update:modelValue', selectValue);
}

</script>