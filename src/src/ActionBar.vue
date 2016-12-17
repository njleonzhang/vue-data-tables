<style lang="scss">

</style>

<template lang="pug">
  div
    el-button(type='primary' v-for="action in actions" @click="action.handler") {{action.name}}
</template>

<script>
  export default {
    props: {
      actions: [Array]
    }
  }
</script>
