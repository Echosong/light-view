<!--
  * 操作记录 列表
  *
  * @Author:    二胡子
  * @Date:      2022-06-02 20:23:08
  * @Wechat:    zhuda1024
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
-->
<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="请求时间" class="smart-query-form-item">
        <a-range-picker @change="changeCreateDate" v-model:value="createDateRange" :presets="defaultChooseTimeRange" style="width: 240px" />
      </a-form-item>

      <a-form-item class="smart-query-form-item smart-margin-left10">
        <a-button-group>
          <a-button type="primary" @click="ajaxQuery">
            <template #icon>
              <ReloadOutlined />
            </template>
            查询
          </a-button>
          <a-button @click="resetQuery">
            <template #icon>
              <SearchOutlined />
            </template>
            重置
          </a-button>
        </a-button-group>
      </a-form-item>
    </a-row>
  </a-form>

  <a-table size="small" :loading="tableLoading" :dataSource="tableData" :columns="columns" bordered rowKey="operateLogId" :pagination="false">
    <template #bodyCell="{ text, record, column }">

    </template>
  </a-table>

  <div class="smart-query-table-page">
    <a-pagination
      showSizeChanger
      showQuickJumper
      show-less-items
      :pageSizeOptions="PAGE_SIZE_OPTIONS"
      :defaultPageSize="queryForm.pageSize"
      v-model:current="queryForm.pageNum"
      v-model:pageSize="queryForm.pageSize"
      :total="total"
      @change="ajaxQuery"
      @showSizeChange="ajaxQuery"
      :show-total="(total) => `共${total}条`"
    />
  </div>

</template>
<script setup>
  import { onMounted, reactive, ref } from 'vue';
  import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
  import { defaultTimeRanges } from '/@/lib/default-time-ranges';
  import { smartSentry } from '/@/lib/smart-sentry';
  import {base} from "/@/utils/base.js";

  const columns = ref([

    {
      title: '请求ip',
      dataIndex: 'requestIp',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      ellipsis: true,
    },
    {
      title: '请求耗时',
      dataIndex: 'time',
      ellipsis: true,
    },
    {
      title: '方法名',
      dataIndex: 'method',
      ellipsis: true,
    },

    {
      title: '时间',
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '参数',
      dataIndex: 'params',
      ellipsis: true,
    }
  ]);

  const queryFormState = {
    startDate: undefined,
    endDate: undefined,
    pageNum: 1,
    pageSize: 10,
  };
  const queryForm = reactive({ ...queryFormState });
  const createDateRange = ref([]);
  const defaultChooseTimeRange = defaultTimeRanges;
  // 时间变动
  function changeCreateDate(dates, dateStrings) {
    queryForm.startDate = dateStrings[0];
    queryForm.endDate = dateStrings[1];
  }

  const tableLoading = ref(false);
  const tableData = ref([]);
  const total = ref(0);

  function resetQuery() {
    Object.assign(queryForm, queryFormState);
    createDateRange.value = [];
    ajaxQuery();
  }

  function onSearch() {
    queryForm.pageNum = 1;
    ajaxQuery();
  }

  async function ajaxQuery() {
    try {
      tableLoading.value = true;
      let responseModel = await base.put('/log/currentListPage',queryForm);


      const list = responseModel.data.content;
      total.value = responseModel.data.total;
      tableData.value = list;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  onMounted(ajaxQuery);

  // ---------------------- 详情 ----------------------
  const detailModal = ref();
  function showDetail(operateLogId) {
    detailModal.value.show(operateLogId);
  }
</script>
