<template>
  <default-home-card icon="BarChartOutlined" title="订单统计">
    <div class="echarts-box">
      <div class="gradient-main" id="gradient-main"></div>
    </div>
  </default-home-card>
</template>
<script setup>
import DefaultHomeCard from '/@/views/system/home/components/default-home-card.vue';
import * as echarts from 'echarts';
import {onMounted} from 'vue';
import {base} from "/@/utils/base.js";

onMounted(() => {
  init();
});

async function init() {
  const st = {
    date: [
      "2024-12-09",
      "2024-12-10",
      "2024-12-11",
      "2024-12-12",
      "2024-12-13",
      "2024-12-14",
      "2024-12-15"
    ],
    counts: [
      2,
      48,
      57,
      6,
      7,
      55,
      70
    ],
    sums: [
      2,
      52,
      15,
      57,
      0,
      45,
      23
    ]
  }

  let option = {
    color: ['#80FFA5', '#FF0087',],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['订单金额', '订单数量'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: st.date,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '订单金额',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [

            {
              offset: 0,
              color: 'rgb(128, 255, 165)',
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: st.sums,
      },


      {
        name: '订单数量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 0, 135)',
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: st.counts,
      },
    ],
  };
  let chartDom = document.getElementById('gradient-main');
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

  .gradient-main {
    width: 95%;
    height: 300px;
    background: #fff;
  }
}
</style>
