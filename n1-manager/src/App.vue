<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    let language = ''
    if (localStorage.language) {
      language = localStorage.language
    } else {
      language = 'zh'
    }
    this.$store.commit('changeLanguage', language)
  }
};
</script>
<style lang="less" scoped>
@import './assets/css/common.less';
</style>


