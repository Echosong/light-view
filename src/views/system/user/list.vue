<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="账号" v-if="!query.username" class="smart-query-form-item">
        <a-input v-model:value="p.username" placeholder="模糊查询"></a-input>
      </a-form-item>
      <a-form-item label="手机号" v-if="!query.mobile" class="smart-query-form-item">
        <a-input v-model:value="p.mobile" placeholder="模糊查询"></a-input>
      </a-form-item>
      <a-form-item label="姓名" v-if="!query.name" class="smart-query-form-item">
        <a-input v-model:value="p.name" placeholder="模糊查询"></a-input>
      </a-form-item>

      <a-form-item label="角色" v-if="!query.name" class="smart-query-form-item">
        <select-data v-model="p.roleId" routeName="role" style="width: 150px;"></select-data>
      </a-form-item>

      <a-form-item class="smart-query-form-item">
        <a-button-group>
          <a-button type="primary" @click="f5">
            <template #icon>
              <SearchOutlined/>
            </template>
            查询
          </a-button>
          <a-button @click="resetQuery" class="smart-margin-left10">
            <template #icon>
              <ReloadOutlined/>
            </template>
            重置
          </a-button>
        </a-button-group>
      </a-form-item>
    </a-row>
  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="add" type="primary">
          <template #icon>
            <PlusOutlined/>
          </template>
          新建
        </a-button>
        <a-button @click="exportFile" type="primary">
          <template #icon>
            <ArrowDownOutlined/>
          </template>
          导出
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
        rowKey="positionId"
        bordered
        :loading="tableLoading"
        :pagination="false"

    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="update(record)" type="link">编辑</a-button>
            <a-button @click="resetPassword(record)" type="link">重置密码</a-button>
            <a-button @click="del(record)" danger type="link">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!---------- 表格 end ----------->

    <Pagination :p="p" @f5="f5" :total="total"></Pagination>
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
import SelectData from "/@/components/framework/base-map/index.vue";
// ---------------------------- 表格列 ----------------------------

const columns = ref([{"title": "账号", "dataIndex": "username", "ellipsis": true, "align": "left"}, {
  "title": "手机号",
  "dataIndex": "mobile",
  "ellipsis": true,
  "align": "left"
}, {"title": "性别", "dataIndex": "sexEnum", "ellipsis": true, "align": "left"}, {
  "title": "工号",
  "dataIndex": "code",
  "ellipsis": true,
  "align": "left"
}, {"title": "姓名", "dataIndex": "name", "ellipsis": true, "align": "left"}, {
  "title": "状态",
  "dataIndex": "stateEnum",
  "ellipsis": true,
  "align": "left"
}, {"title": "邮箱", "dataIndex": "email", "ellipsis": true, "align": "left"}, {
  "title": "注册ip",
  "dataIndex": "regIp",
  "ellipsis": true,
  "align": "left"
}, {"title": "登录ip", "dataIndex": "loginIp", "ellipsis": true, "align": "left"}, {
  "title": "操作",
  "dataIndex": "action",
  "ellipsis": true,
  "align": "left",
  "width": 90,
  "fixed": "right"
}]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const params = {pageSize: 10, page: 1, total: 0, username: '', mobile: '', name: ''}
// 查询表单form
let p = reactive({...params});
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);
// 总数
const total = ref(0);
const addUpdate = ref()
const query = ref({})

// 重置查询条件
function resetQuery() {
  let pageSize = p.pageSize;
  Object.assign(p, params);
  p.pageSize = pageSize;
  f5();
}

function resetPassword(row){
  base.confirm('是否重置密码，此操作不可撤销', async function () {
    let res = await base.get("/user/resetPassword/"+ row.id);
    base.success(res.message + "，密码为::"+ res.data,);
    f5();
  })
}

// 查询数据
async function f5() {
  tableLoading.value = true;
  try {
    let queryResult = await base.put('/user/listPage', p);
    tableData.value = queryResult.data.content;
    total.value = queryResult.data.totalElements;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

const router = useRouter();

onMounted(() => {
  query.value = router.currentRoute.value.query;

  f5()
})

function exportFile() {
  base.download("/user/export", p.value)
}

// ---------------------------- 添加/修改 ----------------------------
function update(row) {
  addUpdate.value.open(row, query.value);
}

function add() {
  addUpdate.value.open(null, query.value);
}

// ---------------------------- 单个删除 ----------------------------
//确认删除
function del(data) {
  base.confirm('是否删除，此操作不可撤销', async function () {
    let res = await base.delete("/user/delete/" + data.id);
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
  await base.post('/user/save', row);
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
