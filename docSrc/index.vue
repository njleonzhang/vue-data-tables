<style lang='scss'>
  .content {
    width: 1000px;
    height: 50%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .title {
    font-size: 20px;
    font-weight: 900;
  }

  .link-wrapper {
    font-size: 18px;
    
    .link {
      display: inline-block;
      width: 50%;
      margin-top: 20px;
    }
  }


</style>

<template lang='pug'>
  .content
    .title Choose the language:
    .link-wrapper
      router-link.link(to='/cn') 中文
      router-link.link(to='/en') English
</template>
