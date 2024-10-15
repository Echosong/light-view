<template>
  <a-select
      v-model:value="changeValue"
      show-search
      placeholder="请选择"
      :options="options"
      :filter-option="filterOption"
      @change="selectTo"
      allowClear
      :disabled="props.disabled"
  ></a-select>
</template>
<script setup>
import {ref} from "@vue/runtime-core";
import {nextTick, onMounted, watch} from "vue";
import {base} from "/@/utils/base";

const changeValue = ref(0)
const options = ref([])
const props = defineProps({
  modelValue: {type: Number, default: 0},
  routeName: {default: ""},
  type: {default: 0},
  disabled: {default: false}
})

onMounted(() => {
  nextTick(async () => {
    const {data} = await base.get("/"+props.routeName+"/getMap?type=" + props.type);
    let ops = [];
    data.forEach(item => {
      ops.push({
        key: item.id,
        value: parseInt(item.id),
        label: item.name
      })
    })
    options.value = ops;
    changeValue.value = parseInt(props.modelValue|| ops[0].value);
  })

})

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const emits = defineEmits(['update:modelValue'])


function selectTo() {
  emits('update:modelValue', changeValue.value);
}

</script>