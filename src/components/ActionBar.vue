<template lang="pug">
  div
    el-button(
      type='primary',
      v-for="action in actions",
      @click="action.handler",
      :icon="action.icon") {{action.name}}
</template>

<script>
  export default {
    props: {
      actions: [Array]
    }
  }
</script>
