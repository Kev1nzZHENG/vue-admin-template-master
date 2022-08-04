<template>
  <el-card class="box-card" style="margin: 10px 0">
    <div class="header" slot="header">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="left">
        <!-- @tab-click="handleClick" -->
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setToday">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- echart图表 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div class="right">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li v-for="attr in rank" :key="attr.no">
                <span :class="rankClass(attr.no)">{{ attr.no }}</span>
                <span class="TmName">{{ attr.name }}</span>
                <span class="rvalue">{{ attr.money }}</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      // tab标签页
      activeName: "sale",
      // 图表
      myChart: null,
      // 时间
      date: [],
      rank: [],
    };
  },
  methods: {
    // 类名
    rankClass(index) {
      if (index >= 4) {
        return "none";
      } else {
        return "rindex";
      }
    },
    setToday() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    // mock数据
    ...mapGetters("home", [
      "orderFullYearAxis",
      "userFullYearAxis",
      "orderFullYear",
      "userFullYear",
      "orderRank",
      "userRank",
    ]),
  },
  watch: {
    title() {
      this.myChart.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.orderFullYearAxis
              : this.userFullYearAxis,
        },
        series: {
          data: this.title == "销售额" ? this.orderFullYear : this.userFullYear,
        },
      });
      this.rank = this.title == "销售额" ? this.orderRank : this.userRank;
    },
    orderFullYearAxis() {
      this.rank = this.orderRank;
      this.myChart.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.orderFullYear,
          },
        ],
      });
    },
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.charts);
    this.myChart.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
};
</script>

<style scoped>
>>> .el-card__header {
  border-bottom: none;
}
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.header .left {
  width: 100%;
}
.header .right {
  position: absolute;
  right: 0;
}
.header .right span {
  cursor: pointer;
  margin: 0 10px;
}
.header .right .date {
  width: 230px;
  margin: 0 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
.content .right {
  padding: 0;
}
.content .right span {
  margin: 0 10px;
}
.content .right .TmName {
  margin-left: 30px;
}

.content .right ul {
  padding: 0;
  list-style: none;
  width: 100%;
  height: 300px;
}
.content .right ul li {
  height: 8%;
  margin: 10px 0;
}
.content .right .rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: #fff;
  text-align: center;
}
.content .right .none {
  float: left;
  width: 20px;
  height: 20px;
  text-align: center;
}
.content .right .rvalue {
  float: right;
  margin-right: 20px;
}
</style>