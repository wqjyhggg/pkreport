<template>
  <div class="breadcrumb text-center">
    <el-row>
      <el-col :span="2">
        <img src="../assets/img/left-b-30.png" @click="backtolast">
      </el-col>
      <el-col :span="19">
        {{ mytitle }}&nbsp;
      </el-col>
      <el-col :span="3">
        <img v-if="submit=='setup'" src="../assets/img/settings.png" @click="sendout">
        <img v-else src="../assets/img/search-b-30.png" @click="sendout">
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: ['backto', 'title', 'submit'],
  data () {
    return {
      mytitle: ''
    }
  },
  methods: {
    backtolast () {
      console.log('Breadcrumb backtolast', this.backto) // XXXXXXXXXXXXXXX
      this.$router.push({name: this.backto})
      // this.$router.push({name: this.backto, params: { para: this.submit }})
    },
    sendout () {
      console.log('Breadcrumb sendout', this.submit) // XXXXXXXXXXXXXXXXX
      this.$emit('submit', this.submit)
    }
  },
  mounted () {
    console.log('Breadcrumb mounted', this.backto, this.submit)
    if (this.title) {
      this.mytitle = this.title
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breadcrumb {
  background: linear-gradient(to bottom, #4ee314 0%, #35af04 100%);
  font-weight: normal;
  color: white;
  height: 2.5rem;
  font-size: 1.5rem;
  padding-top: 0.5rem;
}
.submit {
  padding-right: 1rem;
}
</style>
