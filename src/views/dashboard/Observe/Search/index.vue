<template>
  <el-card>
    <div slot="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <!-- 下拉菜单 -->
        <el-dropdown>
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(keyword, index) in searchWord.slice(0, 5)"
              :key="index"
              >{{ keyword.word }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <LineCharts></LineCharts>
      <!-- 表格 -->
      <el-table :data="searchWord" style="width: 100%" border class="table">
        <el-table-column type="index" label="排名" width="100" align="center">
        </el-table-column>
        <el-table-column prop="word" label="搜索关键字" width>
        </el-table-column>
        <el-table-column prop="user" label="用户数" sortable width>
        </el-table-column>
        <el-table-column prop="count" label="周涨幅" sortable width>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination layout="->,prev, pager, next" :total="1000">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import LineCharts from "./LineCharts";
export default {
  name: "Search",
  components: { LineCharts },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("home", ["searchWord"]),
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.table {
  font-size: 14px;
  margin-top: 15px;
}
</style>