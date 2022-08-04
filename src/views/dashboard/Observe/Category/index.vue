<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radio" size="medium" @change="changeRadio">
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!-- 饼状表格 -->
    <div class="charts" ref="charts"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
export default {
  name: "Category",
  data() {
    return {
      radio: "线上",
      myChart: null,
    };
  },
  methods: {
    changeRadio() {
      this.myChart.setOption({
        title: {
          text:
            this.radio == "线上"
              ? this.onlineData[0].name
              : this.shopData[0].name,
          subtext:
            this.radio == "线上"
              ? this.onlineData[0].value
              : this.shopData[0].value,
        },
        series: [
          {
            data: this.radio == "线上" ? this.onlineData : this.shopData,
          },
        ],
      });
    },
  },
  computed: {
    ...mapGetters("home", ["saleRank"]),
    shopName() {
      return this.saleRank.shop.name;
    },
    shopValue() {
      return this.saleRank.shop.value;
    },
    onlineData() {
      let arr = [];
      const { saleRank } = this;
      for (let i = 0; i < saleRank.online.name.length; i++) {
        let name = saleRank.online.name[i];
        let value = saleRank.online.value[i];
        let obj = { name, value };
        arr.push(obj);
      }
      return arr;
    },
    shopData() {
      let arr = [];
      const { saleRank } = this;
      for (let i = 0; i < saleRank.shop.name.length; i++) {
        let name = saleRank.shop.name[i];
        let value = saleRank.shop.value[i];
        let obj = { name, value };
        arr.push(obj);
      }
      return arr;
    },
  },
  watch: {
    saleRank() {
      this.myChart = echarts.init(this.$refs.charts);
      this.myChart.setOption({
        title: {
          text: this.onlineData[0].name,
          subtext: this.onlineData[0].value,
          left: "center",
          top: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "outside",
            },
            labelLine: {
              show: true,
            },
            data: this.onlineData,
          },
        ],
      });
      this.myChart.on("mouseover", (params) => {
        const { name, value } = params.data;
        this.myChart.setOption({
          title: {
            text: name,
            subtext: value,
          },
        });
      });
    },
  },
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>