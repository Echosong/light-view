<!--
  * 首页
  * 
  * @Author:    二胡子
  * @Date:      2022-09-12 22:34:00 
  * @Wechat:    zhuda1024 
  * @Email:     zq_songfeigang@163.com
  * @Copyright  1024创新实验室 （ http://www.hn1024.cn ），Since 2012
  *
-->
<template>
  <!--  顶部用户信息-->
  <a-row>
    <HomeHeader />
  </a-row>
  <!--下方左右布局-->
  <a-row :gutter="[10, 10]">
    <!--左侧-->
    <a-col :span="24">
      <a-row :gutter="[10, 10]">
        <!--公告信息-->
<!--        <a-col :span="12">
          <HomeNotice title="公告" :noticeTypeId="1" />
        </a-col>
        &lt;!&ndash;企业动态&ndash;&gt;
        <a-col :span="12">
          <HomeNotice title="通知" :noticeTypeId="2" />
        </a-col>-->
        <!--各类报表-->
        <!-- <a-col :span="6">
          <Gauge :percent="saleTargetPercent" />
        </a-col> -->
        <a-col :span="12">
          <Pie />
        </a-col>
        <a-col :span="12">
          <Category />
        </a-col>
        <a-col :span="24">
          <Gradient />
        </a-col>
      </a-row>
    </a-col>
    <!--右侧-->
  </a-row>
</template>
<script setup>
  import HomeHeader from './home-header.vue';
  import HomeNotice from './home-notice.vue';
  import Category from './components/echarts/category.vue';
  import Pie from './components/echarts/pie.vue';
  import Gradient from './components/echarts/gradient.vue';
</script>
<style lang="less" scoped>
  @import './index.less';
</style>
