<style lang='scss'>
  .sc-checkbox-group {
    padding-top: 9px;
  }
</style>

<template lang="pug">
  .sc-checkbox-group
    el-checkbox-group(v-model='checkList', @change="changeHandler")
      el-checkbox(v-for="check in checks", :label="check.code", :key="check.code" :checked="check.checked") {{check.name}}
</template>

<script>
  export default {
    props: {
      checks: [Array]
    },

    mounted() {
      this.$emit('checkChange', this.checkList)
    },

    data() {
      return {
        checkList: []
      }
    },

    methods: {
      changeHandler() {
        this.$emit('checkChange', this.checkList)
      }
    }
  }
</script>
