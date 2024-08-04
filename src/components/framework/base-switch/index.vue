<template>
  <a-switch v-model:checked="switchValue"  @change="change"  />
</template>
<script lang="ts" setup>

import {onMounted, ref,watch} from "vue";
const props = defineProps({
  modelValue: {type:Number, default: false},
  size:{type:String,default:'small'}
})

const switchValue = ref(props.modelValue > 0)

const emits = defineEmits(['update:modelValue','change'])

onMounted(()=>{

})
watch(() => props.modelValue, async (newVal, oldVal) => {
  if (newVal) {
    switchValue.value = newVal > 0
  } else {
    switchValue.value = false
  }
})

function change(){
  emits('update:modelValue', switchValue.value? 1: 0)
  emits('change',switchValue.value)
}

</script>

