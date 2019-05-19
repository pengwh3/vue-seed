<template>
  <div>
    <h1 class="animated flipInX">您无权使用此功能，请联系管理员</h1>
    <div class="back animated bounceInUp">
      <i title="返回" class="fa fa-reply-all" @click="goBack"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: "您无权使用此功能，请联系管理员",
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 5em;
  font-family: fantasy;
  color: #475669;
  letter-spacing: 25px;
  margin-top: 0;
  padding-top: 25vh;
}

.back {
  padding-right: 3em;
  text-align: right;
  i {
    font-size: 2em;
    color: #475669;
    &:hover {
      cursor: pointer;
      color: #324057;
    }
  }
}
</style>
