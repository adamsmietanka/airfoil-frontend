<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>{{ span }}</p>
    <p>{{ chord_fuse }}</p>
    <p>{{ chord_tip }}</p>
    <p>{{ angle }}</p>
    <p>{{ selected_airfoil }}</p>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "About",
  methods: {
    ...mapMutations([
      "SET_SPAN",
      "SET_CHORD_FUSE",
      "SET_CHORD_TIP",
      "SET_ANGLE",
      "SET_AIRFOIL",
    ]),
  },
  computed: {
    ...mapState([
      "span",
      "chord_fuse",
      "chord_tip",
      "angle",
      "selected_airfoil",
    ]),
  },
};
</script>
