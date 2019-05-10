<template>
    <div>
        角色管理
      <el-button type="primary" v-bind:disabled="isAddDisabled">增加</el-button>
      <el-button type="danger" v-bind:disabled="isDeleteDisabled">删除</el-button>
      <el-button type="warning" v-bind:disabled="isUpdateDisabled">修改</el-button>
      <el-button type="primary" v-bind:disabled="isSelectDisabled">单个查询</el-button>
      <el-button type="primary" v-bind:disabled="isSelectListDisabled">list查询</el-button>
    </div>
</template>
<script>
import {checkResources} from "../../utils";

export default {
  name: 'about',
  components: {

  },
  data() {
    return {
      isAddDisabled : checkResources("/system/addRole"),
      isDeleteDisabled : checkResources("/system/deleteRole"),
      isUpdateDisabled : checkResources("/system/updateRole"),
      isSelectDisabled : checkResources("/system/selectRole"),
      isSelectListDisabled : checkResources("/system/selectRoleList")
    }
  },
  methods:{

  }
};
</script>
<style scoped lang="scss">

</style>
