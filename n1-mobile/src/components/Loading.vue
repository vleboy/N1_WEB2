<template>
  <v-layout row justify-center>
    <v-dialog v-model="openLoading" persistent content content-class="centered-dialog">
      <v-container fill-height>
        <v-layout column justify-center align-center>
          <v-progress-circular indeterminate :size="64" :color="progressColor"></v-progress-circular>
          <h3 v-if="message != null">{{message}}</h3>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: "Loading",
  computed: {
    openLoading: {
      get() {
        return this.$store.state.openLoading;
      },
      set(val) {
        this.$store.commit("openLoading", val);
      }
    }
  },
  data: function() {
    return {};
  },
  props: {
    value: { type: Boolean, default: false },
    message: { type: String, default: null },
    progressColor: { type: String, default: "white" }
  }
};
</script>

<style>
.dialog.centered-dialog,
.v-dialog.centered-dialog {
  /* background: #282c2dad; */
  /* border-radius: 6px; */
  box-shadow: none;
  width: auto;
  color: whitesmoke;
}
</style>
  
