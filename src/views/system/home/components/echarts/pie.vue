<template>
  <default-home-card icon="PieChartOutlined" title="会员统计">
    <div class="echarts-box">
      <div class="pie-main" id="pie-main"></div>
    </div>
  </default-home-card>
</template>
<script setup>
  import DefaultHomeCard from '/@/views/system/home/components/default-home-card.vue';
  import * as echarts from 'echarts';
  import { onMounted } from 'vue';
  import {base} from "/@/utils/base.js";

  onMounted(() => {
    init();
  });

  async function init() {
    const  st = await base.get('/member/statistic/num')
    const stData = st.data;
    let option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: '会员统计',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: stData.num, name: '总人数' },
            { value: stData.manNum, name: '男性' },
            { value: stData.womanNum, name: '女性' },
          ],
        },
      ],
    };
    let chartDom = document.getElementById('pie-main');
    if (chartDom) {
      let myChart = echarts.init(chartDom);
      option && myChart.setOption(option);
    }
  }
</script>
<style lang="less" scoped>
  .echarts-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .pie-main {
      width: 260px;
      height: 260px;
      background: #fff;
    }
  }
</style>
