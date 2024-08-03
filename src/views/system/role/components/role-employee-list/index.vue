<!--
  * 角色 员工 列表
  *
  * @Author:    二胡子
  * @Date:      2022-09-12 22:34:00
  * @Wechat:    zhuda1024
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
  *
-->
<template>
  <div>
    <div class="header">
      <div>
        关键字：
        <a-input style="width: 250px" v-model:value="queryForm.keywords" placeholder="姓名/手机号/登录账号" />
        <a-button class="button-style" v-if="selectRoleId" type="primary" @click="onSearch">搜索</a-button>
        <a-button class="button-style" v-if="selectRoleId" type="default" @click="resetQueryRoleEmployee">重置</a-button>
      </div>
    </div>
    <a-table
      :loading="tableLoading"
      :dataSource="tableData"
      :columns="columns"
      :pagination="false"
      :scroll="{ y: 400 }"
      rowKey="employeeId"
      size="small"
      bordered
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'disabledFlag'">
          <a-tag :color="text ? 'error' : 'processing'">{{ text ? '禁用' : '启用' }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'gender'">
          <span>{{ $smartEnumPlugin.getDescByValue('GENDER_ENUM', text) }}</span>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <a @click="deleteEmployeeRole(record.employeeId)" v-privilege="'system:role:employee:delete'">移除</a>
        </template>
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
        @change="queryRoleEmployee"
        @showSizeChange="queryRoleEmployee"
        :show-total="showTableTotal"
      />
    </div>
    <EmployeeTableSelectModal ref="selectEmployeeModal" @selectData="selectData" />
  </div>
</template>
<script setup>

  import {  inject, onMounted, reactive, ref, watch } from 'vue';
  import { userApi } from '/src/api/system/user-api';
  import { PAGE_SIZE, showTableTotal, PAGE_SIZE_OPTIONS } from '/src/constants/common-const';
  import EmployeeTableSelectModal from '/src/components/system/employee-table-select-modal/index.vue';
  import { smartSentry } from '/src/lib/smart-sentry';

  // ----------------------- 以下是字段定义 emits props ---------------------
  let selectRoleId = inject('selectRoleId');

  // ----------------------- 员工列表：显示和搜索 ------------------------
  watch(
    () => selectRoleId.value,
    () => queryRoleEmployee()
  );

  onMounted(queryRoleEmployee);

  const defaultQueryForm = {
    pageNum: 1,
    pageSize: PAGE_SIZE,
    roleId: undefined,
    keywords: undefined,
  };
  // 查询表单
  const queryForm = reactive({ ...defaultQueryForm });
  // 总数
  const total = ref(0);
  // 表格数据
  const tableData = ref([]);
  // 表格loading效果
  const tableLoading = ref(false);

  function resetQueryRoleEmployee() {
    queryForm.keywords = '';
    queryRoleEmployee();
  }

  function onSearch() {
    queryForm.pageNum = 1;
    queryRoleEmployee();
  }

  async function queryRoleEmployee() {
    try {
      tableLoading.value = true;
      queryForm.roleId = selectRoleId.value;
      let res = await userApi.listPage(queryForm);
      tableData.value = res.data.content;
      total.value = res.data.total;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  const columns = reactive([
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '登录账号',
      dataIndex: 'username',
    },
    {
      title: '部门',
      dataIndex: 'roleName',
    },
    {
      title: '状态',
      dataIndex: 'stateEnum',
    }
  ]);
</script>

<style scoped lang="less">
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
  }
  .button-style {
    margin: 0 10px;
  }
</style>
