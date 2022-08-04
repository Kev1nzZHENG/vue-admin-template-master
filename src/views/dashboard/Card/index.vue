<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" :count="`￥ ${list.salesTotal}`">
            <template slot="charts">
              <span
                >月同比&nbsp;&nbsp;&nbsp;{{ list.salesGrowthLastMonth }}%<i
                  class="el-icon-caret-top"
                ></i
              ></span>
              <span class="span2"
                >日同比&nbsp;&nbsp;&nbsp;{{ list.salesGrowthLastDay }}%<i
                  class="el-icon-caret-bottom"
                ></i
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥{{ list.salesToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" :count="list.visitTotal">
            <template slot="charts">
              <LineChart></LineChart>
            </template>
            <template slot="footer">
              <span>日访问量 {{ list.visitToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" :count="list.payTotal">
            <template slot="charts">
              <BarChart></BarChart>
            </template>
            <template slot="footer">
              <span>转化率 {{ list.payRate }}%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" :count="`${list.activityRate}%`">
            <template slot="charts">
              <ProgessChart :count="list.activityRate"></ProgessChart>
            </template>
            <template slot="footer">
              <span
                >月同比&nbsp;&nbsp;&nbsp;{{ list.activityGrowthLastMonth }}%<i
                  class="el-icon-caret-top"
                ></i
              ></span>
              <span class="span2"
                >日同比&nbsp;&nbsp;&nbsp;{{ list.activityGrowthLastDay }}%<i
                  class="el-icon-caret-bottom"
                ></i
              ></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import ProgessChart from "./ProgessChart";
import { mapState } from "vuex";
export default {
  name: "Card",
  components: { Detail, LineChart, BarChart, ProgessChart },
  computed: {
    ...mapState("home", ["list"]),
  },
};
</script>

<style>
.el-icon-caret-top {
  color: #30ce4c;
}
.el-icon-caret-bottom {
  color: #d53c26;
}
.span2 {
  padding-left: 13px;
}
</style>