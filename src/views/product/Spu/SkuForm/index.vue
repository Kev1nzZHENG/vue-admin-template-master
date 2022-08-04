<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuInfo.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input
        placeholder="重量(千克)"
        v-model="skuInfo.weight"
        type="number"
      ></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        placeholder="规格描述"
        rows="4"
        v-model="skuInfo.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          :label="attr.attrName"
          v-for="attr in attrInfoList"
          :key="attr.id"
        >
          <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" ref="form" label-width="80px">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
        >
          <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table
        style="width: 100%"
        border
        :data="spuImageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80"> </el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              v-if="row.isDefault == 0"
              @click="changeDefault(row)"
              >设为默认</el-button
            >
            <el-tag type="success" v-else>默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addSku">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性信息
      spuSaleAttrList: [],
      //存储平台属性信息
      attrInfoList: [],
      // 存储skuform信息
      skuInfo: {
        // 父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // v-model表单收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 代码获取收集
        // 默认图片
        skuDefaultImg: "",
        // 收集图片
        skuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        // 平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],

        // 销售属性
        skuSaleAttrValueList: [
          /* {
            saleAttrId: 0,
            saleAttrValueId: 0,
          }, */
        ],
      },
      spu: {},
      // 收集图片数据
      imageList: [],
    };
  },
  methods: {
    // 获取SkuForm数据
    async getData(cForm, spu) {
      const { category1Id, category2Id, category3Id } = cForm;
      // 收集父组件传给子组件的信息
      this.skuInfo.category3Id = category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //获取图片数据
      let ImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (ImageResult.code == 200) {
        let list = ImageResult.data;
        // 给图片数据添加isDefault字段
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性数据
      let SaleAttrResult = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (SaleAttrResult.code == 200) {
        this.spuSaleAttrList = SaleAttrResult.data;
      }
      //获取平台属性数据
      let AttrResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (AttrResult.code == 200) {
        this.attrInfoList = AttrResult.data;
      }
    },
    // table表格复选框选中事件
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    // table表格中按钮点击事件：设为默认
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 修改上传数据图片默认值
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮回调：通知父组件切换场景
    cancel() {
      this.$emit("changeScenes", 0);
      // 清楚数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存提交数据
    async addSku() {
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      skuInfo.skuAttrValueList = attrInfoList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          pre.push({ attrId, valueId });
        }
        return pre;
      }, []);
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((pre, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          pre.push({ saleAttrId, saleAttrValueId });
        }
        return pre;
      }, []);
      // 整理图片数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      // 要设置默认值
      let flag = skuInfo.skuImageList.some((item) => {
        return item.isDefault == 1;
      });
      if (flag == false) {
        this.$message({ type: "error", message: "请设置默认值" });
        return;
      }
      // 整理完数据后发送请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: "success", message: "添加SKU成功" });
        this.$emit("changeScenes", 0);
      }
      // 清楚数据
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
</style>