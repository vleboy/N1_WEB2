<template>
  <v-container>
    <v-bottom-nav :active.sync="bottomNav" :value="true" height=50 fixed>
      <v-btn flat color="#1c2327" to="home" @click="showFatherView(0)">
        <span>玩家管理</span>
        <v-icon>mood</v-icon>
      </v-btn>
      <v-btn flat color="#1c2327" to="agent" @click="showFatherView(1)">
        <span>下级代理</span>
        <v-icon>people</v-icon>
      </v-btn>
      <v-btn flat color="#1c2327" to="explore" @click="showFatherView(2)">
        <span>输赢报表</span>
        <v-icon>trending_up</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: 0
    };
  },
  created: function() {},
  methods: {
    showFatherView(param) {
      this.$parent.showView(param);
    }
  }
};
</script>