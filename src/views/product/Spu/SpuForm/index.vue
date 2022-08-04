<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tmList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="this.spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectAttr.length}未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="saleAttrName"
            label="属性名"
            width="width"
          ></el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        // 三级分类ID
        category3Id: 0,
        // spu名字
        spuName: "",
        // 描述
        description: "",
        // 品牌ID
        tmId: "",
        // SPU图片信息
        spuImageList: [
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          }, */
        ],
        // 销售属性
        spuSaleAttrList: [
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      }, //存储Spu信息
      //存储品牌信息
      tmList: [],
      //存储SPU图片数据
      spuImageList: [],
      // 存储属性
      saleAttrList: [],
      // 收集未选择的销售属性ID和名字
      attrIdAndName: "",
    };
  },
  methods: {
    // 初始化SpuForm数据
    async initSpuData(id) {
      // 获取Spu信息
      let SpuResult = await this.$API.spu.reqSpu(id);
      if (SpuResult.code == 200) {
        this.spu = SpuResult.data;
      }

      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tmList = tradeMarkResult.data;
      }

      //获取Spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(id);
      if (spuImageResult.code == 200) {
        let ImageList = spuImageResult.data;
        // 照片墙需要数组中字段含有name与url字段
        ImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = ImageList;
      }

      // 获取销售属性的数据
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },

    // 照片墙删除功能  file参数：代表的是删除的图片信息      fileList剩余图片的信息
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },

    // 照片墙上传功能
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.spuImageList = fileList;
      }
    },

    // 照片墙预览功能
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 取消按钮，切换场景展示
    cancel() {
      // 切换显示页面
      this.$emit("changeScene", { scene: 0 });
      // 清楚数据
      // this._data可以操作data中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数还行，返回响应式数据为空
      Object.assign(this._data, this.$options.data());
    },

    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      // 往要发送给服务器的数据中进行添加
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空下拉菜单选择框数据
      this.attrIdAndName = "";
    },

    // 添加销售属性的属性值   添加按钮
    addSaleAttrValue(row) {
      // 销售属性中添加inputVisible控制input、button切换
      this.$set(row, "inputVisible", true);
      // 销售属性中添加inputValue收集销售属性值
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },

    // input失去焦点
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 属性值不能为空
      if (inputValue.trim() == "") {
        this.$message.error("输入属性值不能为空");
        row.inputVisible = false;
        return;
      }
      // 属性值不能重复
      let flag = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });
      if (flag) {
        row.spuSaleAttrValueList.push(newSaleAttrValue);
        row.inputVisible = false;
        row.inputValue = "";
      } else {
        this.$message.error("属性值不能重复");
        this.$nextTick(() => {
          this.$refs.saveTagInput.focus();
        });
      }
    },

    //关闭标签
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },

    // 删除属性
    deleteAttr(index) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },

    // 保存提交数据
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddorUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        // 通知父组件回到场景0,展示列表重新发送请求
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
        // 清空数据
        Object.assign(this._data, this.$options.data());
      } else {
        this.$message({ type: "error", message: "保存失败" });
      }
    },

    // 添加spu按钮
    async addSpuData(category3Id) {
      // 父组件给子组件category3Id值，收集三级分类id
      this.spu.category3Id = category3Id;
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tmList = tradeMarkResult.data;
      }
      // 获取销售属性的数据
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectAttr() {
      // 整个平台的销售属性一共三个：颜色、版本、尺寸  saleAttrList
      // 当前SPU自己拥有的属性    spu.spuSaleAttrList
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>