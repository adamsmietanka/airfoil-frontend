<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ span }}</p>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "About",
  methods: {
    ...mapMutations(["SET_SPAN"]),
  },
  computed: {
    ...mapState(["span"]),
  },
};
</script>
