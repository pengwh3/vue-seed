<template>
    <div>
        <!--<contact-card></contact-card>-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-edit"></i>
          <span>关于</span>
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
        {name: "某网友的独白", path: "../../../static/img/comment.png"},
        {name: "", path: "../../../static/img/flight_night.jpg"},
        {name: "", path: "../../../static/img/sydney_bridge.jpg"},
        {name: "", path: "../../../static/img/sydney_theatre.jpg"}
      ]
    };
  }
};
</script>
<style scoped lang="scss">

</style>
