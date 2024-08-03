<script setup>
import {defineEmits} from "vue";
import {PAGE_SIZE_OPTIONS} from "/@/constants/common-const.js";

const props = defineProps({
  p:{
    type:Object,
    default:{page:1, pageSize:10, total:0}
  },
  total:{
    type:Number,
    default:0
  }
})

const emit = defineEmits(["f5"])

function gotoPage(){
  emit("f5",true)
}

</script>

<template>

  <div class="smart-query-table-page">
    <a-pagination
        showSizeChanger
        showQuickJumper
        show-less-items
        :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="p.pageSize"
        v-model:current="p.page"
        v-model:pageSize="p.pageSize"
        :total="total"
        @change="gotoPage"
        @showSizeChange="gotoPage"
        :show-total="(total) => `共${total}条`"
    />
  </div>
</template>