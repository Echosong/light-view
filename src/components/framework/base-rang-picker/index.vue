<template>
  <a-space direction="vertical" :size="12">
    <a-range-picker v-model:value="value1" />
  </a-space>
</template>
<script setup>
import { ref } from 'vue';
const value1 = ref();
const value2 = ref();
const value3 = ref();
const value4 = ref();
const value5 = ref();
</script>