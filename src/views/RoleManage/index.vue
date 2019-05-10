<template>
    <div>
        角色管理
      <el-button type="primary">增加</el-button>
      <el-button type="danger">删除</el-button>
      <el-button type="warning">修改</el-button>
    </div>
</template>
<script>
import ContactCard from '@/components/ContactCard'
export default {
    name: 'about',
    components: {
        ContactCard,
    }
};
</script>
<style scoped lang="scss">

</style>
