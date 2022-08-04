<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :control="scene != 0"
      ></CategorySelect>
    </el-card>

    <el-card>
      <!-- 展示spu列表结构 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!cForm.category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table :data="spuList" style="width: 100%; margin-top: 10px" border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="width"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="spu描述"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改Spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前Spu全部sku列表"
                @click="showDialog(row)"
              ></el-button>
              <!-- 删除气泡框 -->
              <el-popconfirm
                confirm-button-text="好的"
                cancel-button-text="不用了"
                icon="el-icon-info"
                icon-color="red"
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除Spu"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          class="pagination"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>

      <!-- 添加spu | 修改spu -->
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="Spu"
      ></SpuForm>

      <!-- 添加sku -->
      <SkuForm
        v-show="scene == 2"
        ref="Sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="closeDialog"
    >
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            /> </template
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      cForm: {},
      // 控制三级的可操作性
      show: true,
      //分页器
      page: 1,
      limit: 3,
      total: 3,
      // spu列表数据
      spuList: [],
      // 切换场景  0：展示SPU列表数据    1：展示添加spu | 修改spu   2：添加SKU
      scene: 0,
      // 控制对话框显示与隐藏
      dialogTableVisible: false,

      // 查看spu列表按钮row信息
      spu: {},
      // sku列表信息
      skuList: [],
      // sku列表加载效果控制
      loading: true,
    };
  },
  methods: {
    // 获取spu列表数据
    async getSpuList() {
      const { page, limit } = this;
      const { category3Id } = this.cForm;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      //   console.log(result);
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 自定义事件回调
    getCategoryId(cForm) {
      this.cForm = cForm;
      this.getSpuList();
    },

    // 改变页码
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    // 改变展示的数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮回调
    addSpu() {
      this.scene = 1;
      // 通知子组件发送请求
      this.$refs.Spu.addSpuData(this.cForm.category3Id);
    },

    // 编辑修改spu
    updateSpu(row) {
      this.scene = 1;
      // 通知子组件发送请求
      this.$refs.Spu.initSpuData(row.id);
    },

    // 自定义事件：切换场景,重新展示列表数据
    changeScene({ scene, flag }) {
      this.scene = scene;
      // flag: 判断是 "修改" : "添加",
      if (flag == "添加") {
        this.page = 1;
      }
      this.getSpuList();
    },
    // 只切换场景
    changeScenes(scene) {
      this.scene = scene;
    },

    // 删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        if (this.spuList.length <= 1) {
          if (this.page != 1) this.page = this.page - 1;
        }
        this.getSpuList();
      } else {
        this.$message({ type: "error", message: "删除失败" });
      }
    },

    // 添加sku按钮的回调
    addSku(row) {
      this.scene = 2;
      // 让子组件发送请求
      this.$refs.Sku.getData(this.cForm, row);
    },

    // 查看sku列表
    async showDialog(row) {
      // 控制弹框显示与隐藏
      this.dialogTableVisible = true;
      // 保存spu信息，进行标题展示
      this.spu = row;
      // 获取sku列表数据
      let result = await this.$API.spu.reqShowSku(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },

    //关闭弹出框dialog
    closeDialog(done) {
      // 重新开启loading加载效果
      this.loading = true;
      // 清空skuList数据，防止数据回显
      this.skuList = [];
      // 关闭弹出框
      done();
    },
  },
};
</script>

<style scoped>
.pagination {
  text-align: center;
}
</style>