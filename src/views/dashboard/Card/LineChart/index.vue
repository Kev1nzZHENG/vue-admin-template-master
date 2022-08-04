<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
export default {
  name: "LineChart",
  computed: {
    ...mapGetters("home", ["visitTrend"]),
  },
  watch: {
    visitTrend() {
      let lineChart = echarts.init(this.$refs.charts);
      lineChart.setOption({
        xAxis: {
          show: false,
          type: "category",
        },
        yAxis: {
          show: false,
        },
        //  系列
        series: [
          {
            type: "line",
            smooth: true, //弧度
            data: this.visitTrend,
            //拐点样式
            itemStyle: {
              opacity: 0,
            },
            //线条样式
            lineStyle: {
              color: "purple",
            },
            //区域填充
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "purple", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
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