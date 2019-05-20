<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-edit"></i>
        <span>角色管理</span>
      </div>
    <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="queryCriteria.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getData" v-bind:disabled="buttonControl.isSelectArrayDisabled">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleAdd" v-bind:disabled="buttonControl.isAddDisabled">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" v-on:click="deleteSubmit" v-bind:disabled="buttonControl.isDeleteDisabled">删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

    <!--列表-->
      <el-table :data="tableData.dataArray" @selection-change="rowSelectedChange" border stripe style="width: 100%;" :header-cell-style="{background:'#F3F4F7'}" v-loading="tableData.isLoading">
        <el-table-column type="selection" min-width="5%" align="center"></el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="85%" ></el-table-column>
        <el-table-column label="操作" min-width="10%" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" v-bind:disabled="buttonControl.isUpdateDisabled" v-on:click="handleEdit(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    <!--底部工具条-->
      <el-col :span="24" class="toolbar" style="padding: 20px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageData.currentPage"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total=pageData.total
          style="float:right;font-weight: normal;">
        </el-pagination>
      </el-col>
    </el-card>

    <!--新增界面-->
    <el-dialog :title="addOrEditFormData.title" :visible.sync="addOrEditFormData.addFormVisible" :close-on-click-modal="false" :modal-append-to-body="false">
      <el-form :model="addOrEditFormData" label-width="100px" :rules="addOrEditFormRules" ref="addForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addOrEditFormData.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置资源">
          <el-tree ref="resourceTree"
            :default-checked-keys="addOrEditFormData.selectedResourceArray"
            :data="addOrEditFormData.allResourceTreeArray"
            show-checkbox
            node-key="id"
            :default-expand-all="addOrEditFormData.isExpandAll"
            :props="{children: 'children', label: 'name'}">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addOrEditFormData.addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addOrEditFormData.id === 0? addSubmit() : editSubmit()" :loading="addOrEditFormData.addLoading">提交</el-button>
      </div>
    </el-dialog>

  </section>

</template>

<script>
import {checkResources} from "../../utils";
import {convertNodeArrayToTreeNodeArray} from "../../utils";
import {generateIdArrayAndAddParentIds} from "../../utils";

export default {
  name: 'about',
  components: {

  },
  data() {
    return {
      //根据保存的权限来控制按钮是否可用
      buttonControl: {
        isAddDisabled : !(checkResources("/system/addRole") && checkResources("/system/selectAllResources")),
        isDeleteDisabled : !checkResources("/system/deleteRole"),
        isUpdateDisabled : !(checkResources("/system/updateRole") && checkResources("/system/selectAllResources") && checkResources("/system/selectRole")),
        isSelectArrayDisabled : !checkResources("/system/selectRoleArray"),
      },
      //查询条件
      queryCriteria: {
          name : ""
      },
      tableData: {
        //table是否显示旋转表示在读取数据中
        isLoading: false,
        //table数据
        dataArray: [],
        //列表选中项（删除用）
        rowSelected: []
      },
      pageData: {
        //当前页数
        currentPage : 1,
        //每页几条
        pageSize : 10,
        //总条数
        total : 0,
      },
      //新增/修改窗口的用户输入规则
      addOrEditFormRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      //新增界面数据
      addOrEditFormData: {
        //控制新增窗口显示
        addFormVisible: false,
        title: "",
        id: 0,
        name: "",
        isExpandAll: true,
        allResourceTreeArray: [],
        selectedResourceArray: [],
        addLoading: false
      },
    }
  },
  methods: {
    handleSizeChange: function (val) {
      // console.log(`每页 ${val} 条`);
      this.pageData.pageSize = val;
      this.getData()
    },
    handleCurrentChange: function (val) {
      // console.log(`当前页: ${val}`);
      this.pageData.currentPage = val;
      this.getData()
    },
    getData: function ()  {
      this.tableData.isTableLoading = true;
      this.$axios({
        url: "selectRoleArray",
        method: "GET",
        params: {
          roleName: this.queryCriteria.name,
          pageSize: this.pageData.pageSize,
          currentPage: this.pageData.currentPage
        }
      }).then(res => {
        this.tableData.dataArray = res.data.data.dataArray;
        this.pageData.pageSize = res.data.data.pageSize;
        this.pageData.currentPage = res.data.data.currentPage;
        this.pageData.total = res.data.data.total;
        this.tableData.isTableLoading = false;
      });
    },
    //显示新增界面
    handleAdd: function () {
      this.addOrEditFormData.id = 0;
      this.addOrEditFormData.title = "新增";
      this.addOrEditFormData.name = "";
      this.addOrEditFormData.selectedResourceArray = [];
      this.$axios.all([
        this.selectAllResources(),
      ]).then(this.$axios.spread((resourceResp) => {
        this.addOrEditFormData.allResourceTreeArray = convertNodeArrayToTreeNodeArray(resourceResp.data.data.dataArray);
        this.addOrEditFormData.addFormVisible = true;
      }));
    },
    //新增提交
    addSubmit: function () {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addOrEditFormData.addLoading = true;
          this.$axios({
            url: "addRole",
            method: "POST",
            data: {
              name: this.addOrEditFormData.name,
              resourceIdArray: generateIdArrayAndAddParentIds(this.$refs.resourceTree.getCheckedNodes(),this.addOrEditFormData.allResourceTreeArray),
            }
          }).then(res => {
            if (res.data.data === true) {
              this.$message.success("添加成功");
              this.getData();
              this.addOrEditFormData.addFormVisible = false;
            }else{
              this.$message.success("添加失败");
            }
            this.addOrEditFormData.addLoading = false;
          });
        }
      });
    },
    handleEdit: function (id) {
      this.addOrEditFormData.title = "修改";
      this.addOrEditFormData.selectedResourceArray = [];
      this.$axios.all([
        this.selectAllResources(),
        this.$axios({url: "selectRole", method: "GET", params: {id: id}})
      ]).then(this.$axios.spread((resourceResp,roleResp) => {
        this.addOrEditFormData.allResourceTreeArray = convertNodeArrayToTreeNodeArray(resourceResp.data.data.dataArray);
        let dataObject = roleResp.data.data.dataObject;
        this.addOrEditFormData.id = dataObject.id;
        this.addOrEditFormData.name = dataObject.name;
        let selectedResourceArray = dataObject.resourceArray || [];
        for (let i = 0; i < selectedResourceArray.length; i ++){
          if (!this.isParentNode(selectedResourceArray[i], selectedResourceArray)) {
            this.addOrEditFormData.selectedResourceArray.push(selectedResourceArray[i].id);
          }
        }
        this.addOrEditFormData.addFormVisible = true;
      }));
    },
    editSubmit: function () {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.addOrEditFormData.addLoading = true;
          this.$axios({
            url: "updateRole",
            method: "POST",
            data: {
              id: this.addOrEditFormData.id,
              name: this.addOrEditFormData.name,
              resourceIdArray: generateIdArrayAndAddParentIds(this.$refs.resourceTree.getCheckedNodes(),this.addOrEditFormData.allResourceTreeArray),
            }
          }).then(res => {
            if (res.data.data === true) {
              this.$message.success("修改成功");
              this.getData();
              this.addOrEditFormData.addFormVisible = false;
            }else{
              this.$message.error("修改失败");
            }
            this.addOrEditFormData.addLoading = false;
          });
        }
      });
    },
    rowSelectedChange: function (rowSelected) {
      this.tableData.rowSelected = rowSelected;
    },
    deleteSubmit: function () {
      let selectedRowArray = this.tableData.rowSelected;
      if (selectedRowArray.length === 0) {
        this.$message.warning("请至少选择一项");
        return false;
      }
      this.$confirm("此操作将永久删除这些项目，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let idArray = [];
        for (let i = 0; i < selectedRowArray.length; i++) {
          idArray.push(selectedRowArray[i].id);
        }
        //调用API，删除
        this.$axios({url: "deleteRole", method: "POST", data: {idArray: idArray}}).then(res => {
          if (res.data.data === true) {
            this.$message.success("删除成功");
            this.getData();
          }else{
            this.$message.error("删除失败");
          }
        });
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    isParentNode: function (resource, resourceArray){
      //判断某菜单节点是否为父节点（根节点或父节点都算）
      for (let i = 0; i < resourceArray.length; i ++){
        if (resource.id === resourceArray[i].pid){
          return true;
        }
      }
      return false;
    },
    selectAllResources: function () {
      return this.$axios({url: "selectAllResources", method: "GET"});
    }
  },
  mounted() {
    this.getData();
  }
}
</script>
<style scoped lang="scss">

</style>
