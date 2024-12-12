<template>
  <default-home-card icon="Profile" title="商品统计">
    <div class="echarts-box">
      <div class="category-main" id="category-main"></div>
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
  const  st = {
    "data": [
      {
        "cateId": 3,
        "name": "健康产业",
        "value": 10
      },
      {
        "cateId": 5,
        "name": "低碳旅游",
        "value": 1
      },
      {
        "cateId": 0,
        "name": "供应商测试品类",
        "value": 0
      }
    ],
    "code": 200,
    "message": "成功"
  }
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
        data: st.data,
      },
    ],
  };
  let chartDom = document.getElementById('category-main');
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
    .category-main {
      width: 800px;
      height: 280px;
      background: #fff;
    }
  }
</style>
