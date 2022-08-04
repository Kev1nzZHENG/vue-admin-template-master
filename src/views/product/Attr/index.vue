<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!cForm.category3Id"
          @click="addAttr"
          style="margin-bottom: 15px"
          >添加属性</el-button
        >
        <el-table :data="AttrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="value in row.attrValueList"
                :key="value.id"
                style="margin: 0 10px"
                >{{ value.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性 | 修改属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" :model="attrInfo" label-width="80px">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
              ref="nameInput"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="showTable">取消</el-button>
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px 0px"
          border
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.flag"
                @blur="toLook(row, $index)"
                @keyup.native.enter="toLook(row, $index)"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`你确定要删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="showTable">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 收集categoryid
      cForm: {},
      // 属性列表
      AttrList: [],
      // 控制展示table
      isShowTable: true,
      //新增属性 | 修改属性
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //三级分类的ID
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this.cForm;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.AttrList = result.data;
      }
    },
    // 自定义事件回调
    getCategoryId(cForm) {
      this.cForm = cForm;
      this.getAttrList();
    },
    // 添加attr属性按钮
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.cForm.category3Id, //收集三级分类的ID
        categoryLevel: 3,
      };
      this.$nextTick(() => {
        this.$refs.nameInput.focus();
      });
    },
    // 修改attr属性
    updateAttr(row) {
      this.isShowTable = false;
      // 深度拷贝
      this.attrInfo = cloneDeep(row);
      // 添加查看编辑状态
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 展示原始表格
    showTable() {
      this.isShowTable = true;
    },
    // 添加属性值按钮
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, // 控制输入框和span显示切换(编辑与查看模式切换)
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 切换查看模式
    toLook(row, index) {
      if (row.valueName.trim() == "") {
        this.$message.error("输入的属性值不能为空");
        this.$refs[index].focus();
        return;
      }
      // 新增的属性值不能与已有的属性重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message.error("输入的属性值不能相同");
        this.$refs[index].focus();
        return;
      }
      row.flag = false;
    },
    // 切换编辑模式
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡框确认回调事件（删除）
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮，发送请求
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不是空的
          if (item.valueName != "") {
            // 去除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      let result = await this.$API.attr.reqAddAttr(this.attrInfo);
      if (result.code == 200) {
        this.$message({ message: "保存成功", type: "success" });
        this.getAttrList();
        this.isShowTable = true;
      } else {
        this.$message({ message: "保存失败", type: "error" });
      }
    },
    // 删除属性
    async deleteAttr(row) {
      let result = await this.$API.attr.reqDeleteAttr(row.id);
      if (result.code == 200) {
        this.$message({ message: "删除成功", type: "success" });
        this.getAttrList();
      } else {
        this.$message({ message: "删除失败", type: "error" });
      }
    },
  },
};
</script>

<style scoped>
</style>