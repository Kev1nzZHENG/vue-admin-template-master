<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
export default {
  name: "BarChart",
  computed: {
    ...mapGetters("home", ["payTrend"]),
  },
  watch: {
    payTrend() {
      let BarChart = echarts.init(this.$refs.charts);
      BarChart.setOption({
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
            type: "bar",
            data: this.payTrend,
          },
        ],
        //  布局
        grid: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
        // 提示框
        tooltip: {},
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