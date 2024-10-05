<template>
  <!---------- 查询表单form begin ----------->

  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="add({})" type="primary">
          <template #icon>
            <PlusOutlined/>
          </template>
          新建
        </a-button>

      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" tableId="log" :refresh="f5"/>
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table
        size="small"
        :dataSource="tableData"
        :columns="columns"
        rowKey="id"
        bordered
        :loading="tableLoading"
        :pagination="false"
        :defaultExpandAllRows="true"

    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'type'">
          {{["", "目录", "菜单", "按钮"][record.type] }}
        </template>

        <template v-if="column.dataIndex === 'icon'">
          <component :is="$antIcons[text]" />
        </template>


        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="add(record)" type="link">添加下级</a-button>
            <a-button @click="update(record)" type="link">编辑</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!---------- 表格 end ----------->
    <addOrUpdate ref="addUpdate" @reloadList="f5"/>
  </a-card>
</template>
<script setup>
import addOrUpdate from './add.vue';
import {reactive, ref, onMounted} from 'vue';
import {base} from '/@/utils/base';
import Pagination from "/@/components/framework/base-page/index.vue"
import {smartSentry} from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import {useRouter} from "vue-router";

// ---------------------------- 表格列 ----------------------------

const columns = ref([{
  "title": "权限名称",
  "dataIndex": "name",
  "ellipsis": true,
  "align": "left"
}, {"title": "权限描述", "dataIndex": "description", "ellipsis": true, "align": "left"}, {"title": "权限标识", "dataIndex": "perms", "ellipsis": true, "align": "left"}, {
  "title": "组件",
  "dataIndex": "component",
  "ellipsis": true,
  "align": "left"
}, {
  "title": "类型",
  "dataIndex": "type",
  "ellipsis": true,
  "align": "left"
},  {
  "title": "图标",
  "dataIndex": "icon",
  "ellipsis": true,
  "align": "left"
}, {"title": "排序", "dataIndex": "sort", "ellipsis": true, "align": "left"}, {
  "title": "操作",
  "dataIndex": "action",
  "ellipsis": true,
  "align": "left",
  "width": 190,
  "fixed": "right"
}]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const params = {pageSize: 10, page: 1, total: 0, name: ''}
// 查询表单form
let p = reactive({...params});
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);
// 总数
const addUpdate = ref()
const query = ref({})

// 重置查询条件
function resetQuery() {
  f5();
}

// 查询数据
async function f5() {
  tableLoading.value = true;
  try {
    let queryResult = await base.get('/permission/all');
    tableData.value = handleTree(queryResult.data, 0);
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}


function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      // child.actionType = child.actionType.split(',')
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    // 返回第一层
    return father[parentId] === rootId;
  });
  return treeData !== '' ? treeData : data;
}



const router = useRouter();

onMounted(() => {
  f5()
})

function exportFile() {
  base.download("/permission/export", p.value)
}

// ---------------------------- 添加/修改 ----------------------------
function update(row) {
  addUpdate.value.open(row, query.value);
}

function add(row) {
  addUpdate.value.open({parentId: row.id, parentName: row.name, type: (row.type||0) +1}, query.value);
}

// ---------------------------- 单个删除 ----------------------------
//确认删除
function del(data) {
  base.confirm('是否删除，此操作不可撤销', async function () {
    let res = await base.delete("/permission/delete/" + data.id);
    base.success(res.message);
    f5();
  }.bind(this));
}

function shortChange(e) {
  console.log('排序接受', e)
  p.direction = e.order === 'ascending';
  p.sortCol = e.prop;
  f5();
}

async function updateSwitch(row) {
  await base.post('/permission/save', row);
  base.success("更新成功")
}


// 选择表格行
const selectedRowKeyList = ref([]);

function onSelectChange(selectedRowKeys) {
  selectedRowKeyList.value = selectedRowKeys;
}

defineExpose({
  f5
})
</script>
