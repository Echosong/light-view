<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="用户" v-if="!query.username" class="smart-query-form-item">
        <a-input v-model:value="p.username" placeholder="模糊查询"></a-input>
      </a-form-item>
      <a-form-item label="日志类型" v-if="!query.logType" class="smart-query-form-item">
        <input-enum enumName="businessEnum" style="width: 180px;" v-model="p.logType"></input-enum>
      </a-form-item>

      <a-form-item label="描述" v-if="!query.description" class="smart-query-form-item">
        <a-input v-model:value="p.description" placeholder="模糊查询"></a-input>
      </a-form-item>

      <a-form-item label="请求时间" class="smart-query-form-item">
        <a-range-picker @change="changeCreateDate" v-model:value="createDateRange" :presets="defaultChooseTimeRange" style="width: 240px" />
      </a-form-item>
      <a-form-item label="状态" class="smart-query-form-item" @change="f5">
      <a-radio-group v-model:value="p.state" >
        <a-radio-button value="">全部</a-radio-button>
        <a-radio-button :value="1">成功</a-radio-button>
        <a-radio-button :value="0">失败</a-radio-button>
      </a-radio-group>
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
            <a-button @click="update(record)" type="link">查看</a-button>
          </div>
        </template>

        <template v-if="column.dataIndex === 'stateEnum'">
            <a-tag v-if="record.state === 1" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
        <template v-if="column.dataIndex === 'time'">
          <div>{{text}} ms</div>
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
import InputEnum from "/@/components/framework/base-enum/index.vue";
import {defaultTimeRanges} from "/@/lib/default-time-ranges.js";
// ---------------------------- 表格列 ----------------------------

const columns = ref([{
  "title": "用户",
  "dataIndex": "username",
  "ellipsis": true,
  "align": "left",width: 100
}, {"title": "类型", "dataIndex": "logTypeEnum", "ellipsis": true, "align": "left",width: 60},
  {"title": "请求时间", "dataIndex": "createTime", "ellipsis": true, "align": "left",width: 180},

  {
  "title": "请求ip",
  "dataIndex": "requestIp",
  "ellipsis": true,
  "align": "left",width: 180
}, {"title": "描述", "dataIndex": "description", "ellipsis": true, "align": "left"}, {
  "title": "客户端",
  "dataIndex": "browser",
  "ellipsis": true,
  "align": "left"
}, {"title": "请求耗时", "dataIndex": "time", "ellipsis": true, "align": "left", width: 80}, {
  "title": "方法名",
  "dataIndex": "method",
  "ellipsis": true,
  "align": "left"
}, {"title": "参数", "dataIndex": "params", "ellipsis": true, "align": "left"}, {
  "title": "请求路径",
  "dataIndex": "urlPath",
  "ellipsis": true,
  "align": "left"
}, {"title": "状态", "dataIndex": "stateEnum", "ellipsis": true, "align": "left",width: 80}, {
  "title": "操作",
  "dataIndex": "action",
  "ellipsis": true,
  "align": "left",
  "width": 50,
  "fixed": "right"
}]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const params = {pageSize: 10, page: 1, total: 0, username: '', logType: '', description: ''}
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

const createDateRange = ref([]);
const defaultChooseTimeRange = defaultTimeRanges;
// 时间变动
function changeCreateDate(dates, dateStrings) {
  p.startDate = dateStrings[0];
  p.endDate = dateStrings[1];
}


// 重置查询条件
function resetQuery() {
  let pageSize = p.pageSize;
  Object.assign(p, params);
  p.pageSize = pageSize;
  f5();
}

// 查询数据
async function f5() {
  tableLoading.value = true;
  try {
    let queryResult = await base.put('/log/listPage', p);
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
  base.download("/log/export", p.value)
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
    let res = await base.delete("/log/delete/" + data.id);
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
  await base.post('/log/save', row);
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
