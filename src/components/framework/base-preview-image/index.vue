<script setup>
import { onMounted, watch, ref } from 'vue';
const props = defineProps({
  imgUrl: {
    type: String,
    default: ''
  }
})
const src = ref([])
watch(() => props.imgUrl, async (newVal, oldVal) => {
  if (newVal) {
    init(newVal)
  }
})
onMounted(() => {
  init(props.imgUrl)
})
function init(url) {
  src.value = []
  let _images = url ? url.split(',') : ['/assets/img/default.png']
  _images.map(t => {
    if (t.indexOf('.mp4') >= 0) {
      t += '?x-oss-process=video/snapshot,t_100,m_fast,f_jpg,w_0,h_0'
    }
    src.value.push(t)
  })
}
</script>

<template>
  <a-image style="width: 100px; height: 100px" :src="src[0]" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"/>
</template>

<style scoped lang="scss"></style>