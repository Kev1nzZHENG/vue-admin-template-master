<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            @click="cancelSale(row)"
            v-if="row.isSale == 1"
            type="warning"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
          ></el-button>
          <el-button
            @click="onSale(row)"
            type="success"
            icon="el-icon-top"
            size="mini"
            title="上架"
            v-else
          ></el-button>
          <el-button
            @click="edit"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            @click="getSkuInfo(row)"
            type="info"
            icon="el-icon-info"
            size="mini"
          ></el-button>
          <el-button
            @click="deleteSku(row)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉层（查看sku详情按钮） -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }} 元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            type="success"
            v-for="skuAttr in skuInfo.skuAttrValueList"
            :key="skuAttr.id"
            >{{ skuAttr.attrName }}-{{ skuAttr.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="600px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" alt="" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 20,
      //存储Sku列表数据
      records: [],
      // 存储sku详情数据
      skuInfo: {},
      // 抽提层显示与隐藏
      drawer: false,
    };
  },
  methods: {
    // 获取skuList数据
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 分页器改变页码
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    // 分页器改变展示页面数据size
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 商品下架回调
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    // 商品上架回调
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 编辑按钮回调
    edit() {
      this.$message("正在开发中...");
    },
    // 查看按钮，获取sku商品详情
    async getSkuInfo(row) {
      let result = await this.$API.sku.reqSkuInfo(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
        this.drawer = true;
      }
    },
    // 删除按钮，删除sku商品
    async deleteSku(row) {
      let result = await this.$API.sku.reqDeleteSku(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        this.getSkuList();
      } else {
        this.$message({ type: "error", message: "删除失败" });
      }
    },
  },
  mounted() {
    // 获取skuList列表数据
    this.getSkuList();
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray;
}
</style>

<style scoped>
.pagination {
  text-align: center;
}
.el-col {
  margin: 10px;
}
.el-col-5 {
  font-weight: 700;
  font-size: 18px;
  text-align: right;
}
</style>