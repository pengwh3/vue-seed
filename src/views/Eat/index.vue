<template>
    <div>
        <!--<contact-card></contact-card>-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-edit"></i>
          <span>好吃的</span>
        </div>
        <el-row v-for="imageObject in imageObjectArray">
          <el-col style="text-align: center">
            <img alt="" :src="imageObject.path" class="image">
            <div style="padding: 14px;"><span>{{imageObject.name}}</span></div>
          </el-col>
        </el-row>
      </el-card>
    </div>
</template>
<script>
import ContactCard from '@/components/ContactCard'
export default {
  name: 'about',
  components: {
    ContactCard,
  },
  data() {
    return {
      imageObjectArray: [
        {name: "好吃的汉堡", path: "../../../static/img/hamburger.png"},
        {name: "fish&chips", path: "../../../static/img/fish&chips.jpg"},
        {name: "叉烧&烧鸭饭", path: "../../../static/img/roast_duck.jpg"},
        {name: "炸酱面", path: "../../../static/img/noodles.jpg"}
      ]
    };
  }
};
</script>
<style scoped lang="scss">

</style>
