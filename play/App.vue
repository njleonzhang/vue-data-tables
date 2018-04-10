<style lang='scss'>
  body {
    margin: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .app-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>

<template lang="pug">
  .app-wrapper
    <el-button @click="changeToZero">changeToatalToZero</el-button>
    <el-pagination :total='total' @current-change="currentChange"></el-pagination>
</template>

<script>
  export default {
    data() {
      return {
        page: 1,
        total: 100
      }
    },
    methods: {
      changeToZero() {
        this.total = 0
      },
      currentChange(currentPage) {
        this.$message(`${currentPage}`)
      }
    }
  }
</script>
