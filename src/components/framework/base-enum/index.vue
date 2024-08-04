<template>
  <a-select
      v-model:value="changeValue"
      show-search
      placeholder="请选择"
      :options="options"
      :filter-option="filterOption"
      @change="selectTo"
  ></a-select>
</template>
<script setup>
import { ref } from "@vue/runtime-core";
import { onMounted, watch } from "vue";
import {base} from "/@/utils/base";

const changeValue = ref(0)
const options = ref([])
const props = defineProps({
  enumName: { type: String, default: "" },
  modelValue: { type: Number, default: 10000 },
  hasDefault: { type: Boolean, default: true }
})
watch(() => props.modelValue, async (newVal, oldVal) => {
  changeValue.value = parseInt(newVal || 10000);
})
onMounted(async () => {
  const { data } = await base.get("/getEnums?enumName=" + props.enumName);
  for (let item in data) {
    options.value.push({
      value: item.code,
      label: item.name
    })
  }
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