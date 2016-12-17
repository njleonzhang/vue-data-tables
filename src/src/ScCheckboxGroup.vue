<template lang="pug">
  div
    el-checkbox-group(v-model='checkList', @change="changeHandler")
      el-checkbox(v-for="check in checks", :label="check.code") {{check.name}}
</template>

<script>
  export default {
    props: {
      checks: [Array]
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
