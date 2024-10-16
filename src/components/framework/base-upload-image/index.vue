<template>
  <a-upload
      :action="action"
      :multiple="true"
      v-model:file-list="fileList"
      list-type="picture-card"
      :headers="{ 'Authorization': useUserStore().getToken }"
      @change="handleChange"
      @preview="handlePreview"
  >
    <div v-if="fileList.length < maxCount">
      <plus-outlined />
    </div>
  </a-upload>
  <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>
<script setup>
import {defineEmits, onMounted, ref} from 'vue';
import {useUserStore} from "/@/store/modules/system/user.js";

const props = defineProps({
  file: {
    type: String,
    default: ''
  },
  params: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: 'image/*'
  }
})
const action = ref("")
const fileList = ref([])
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const emit = defineEmits(["onSuccess"])

onMounted(() => {
  if (props.file) {
    fileList.value = [{
      name: props.file,
      url: props.file
    }]
  }
  action.value = `/admin/file/upload?folder=${props.params}`
})

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};

const handleChange = info => {
  let resFileList = [...info.fileList];
  // 1. Limit the number of uploaded files
  //    Only to show two recent uploaded files, and old ones will be replaced by the new
  resFileList = resFileList.slice(-2);
  let urls = [];
  // 2. read from response and show file link
  resFileList = resFileList.map(file => {
    if (file.response) {
      // Component will show file.url as link
      file.url = file.response.data.url;
      urls.push(file.response.data.url)
    }
    return file;
  });
  fileList.value = resFileList;
  emit('onSuccess', JSON.stringify(urls))
};

const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
</script>