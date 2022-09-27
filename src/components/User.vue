<template>
  <div class="hello">
    <el-row>
      <el-col :span="6">A1</el-col>
      <el-col :span="6" :offset="6">
        <el-input></el-input>
      </el-col>
      <el-col :span="6">
        <el-button>Button</el-button>
      </el-col>
    </el-row>
    <h1>{{ msg }}</h1>
    <h1>{{ $route.params.para }}</h1>
    <h2>User</h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
