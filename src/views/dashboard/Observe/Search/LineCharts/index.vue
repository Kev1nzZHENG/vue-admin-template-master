<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1%</span>
      <i class="el-icon-caret-top"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineCharts",
  mounted() {
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
          data: [10, 7, 23, 15, 14, 18, 23, 18],
          //拐点样式
          itemStyle: {
            opacity: 0,
          },
          //线条样式
          lineStyle: {
            color: "#789ef5",
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
                  color: "#789ef5", // 0% 处的颜色
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
};
</script>

<style scoped>
.header {
  color: #898c8b;
}
.el-icon-info {
  margin-left: 20px;
}
.main {
  margin: 15px 0;
}
.main-title {
  margin-right: 30px;
  font-size: 25px;
}
.main-content {
  margin-right: 7px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>