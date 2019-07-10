<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$store.commit('changeLanguage', localStorage.language)
  }
};
</script>
<style lang="less" scoped>
@import './assets/css/common.less';
</style>


