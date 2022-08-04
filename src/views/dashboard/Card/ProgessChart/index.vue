<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgessChart",
  props: ["count"],
  watch: {
    count() {
      let ProgessChart = echarts.init(this.$refs.charts);
      ProgessChart.setOption({
        xAxis: {
          show: false,
          min: 0,
          max: 100,
        },
        yAxis: {
          show: false,
          type: "category",
        },
        //  系列
        series: [
          {
            type: "bar",
            data: [this.count],
            //   柱状图颜色
            color: "yellowgreen",
            //   柱状图宽度
            barWidth: "10px",
            //   展示背景
            showBackground: true,
            //   背景样式设置
            backgroundStyle: {
              // 背景颜色
              color: "#f0f0f0",
            },
            //   文本
            label: {
              // 展示
              show: true,
              // 文本内容
              formatter: "|",
              // 位置
              position: "right",
            },
          },
        ],
        //  布局
        grid: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
      });
    },
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>