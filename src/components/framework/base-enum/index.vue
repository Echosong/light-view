<template>
  <a-select
      v-model:value="changeValue"
      show-search
      placeholder="请选择"
      :options="options"
      @change="selectTo"
  ></a-select>
</template>
<script setup>
import {ref} from "@vue/runtime-core";
import {onMounted, watch} from "vue";
import {base} from "/@/utils/base";

const changeValue = ref()
const options = ref([{value: 0, label: "请选择"}])
const props = defineProps({
  enumName: {type: String, default: ""},
  modelValue: {type: Number, default: 0},
  hasDefault: {type: Boolean, default: true}
})
watch(() => props.modelValue, async (newVal) => {
  changeValue.value = parseInt(newVal || 0);
})
onMounted(async () => {
  const {data} = await base.get("/getEnums?enumName=" + props.enumName);
  data.forEach(item => {
    options.value.push({
      value: item.code,
      label: item.name
    })
  })
  changeValue.value = parseInt(props.modelValue || 0);
})

const emits = defineEmits(['update:modelValue'])

function selectTo() {
  emits('update:modelValue', changeValue.value);
}

</script>