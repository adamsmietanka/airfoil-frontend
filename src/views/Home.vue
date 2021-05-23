<template>
  <div class="form">
    <label for="span">Span</label>
    <input id="span" v-model="span" />
    <label for="chord-fuse">Fuselage chord</label>
    <input id="chord-fuse" v-model="chord_fuse" />
    <label for="chord-tip">Tip Chord</label>
    <input id="chord-tip" v-model="chord_tip" />
    <div class="field">
      <label for="angle">Angle</label>
      <input id="angle" v-model="angle" />
    </div>
  </div>
  <div id="wing-plot"></div>
</template>

<script>
import Plotly from "plotly.js-gl3d-dist-min";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      span: 10,
      chord_fuse: 2,
      chord_tip: 1,
      angle: 10,
    };
  },
  computed: {
    trace1() {
      return {
        x: [0, this.span / 2, this.span / 2, 0, 0],
        y: [
          this.chord_fuse,
          (-Math.tan((this.angle * Math.PI) / 180) * this.span) / 2,
          (-Math.tan((this.angle * Math.PI) / 180) * this.span) / 2 -
            this.chord_tip,
          0,
          0,
        ],
        type: "scatter",
      };
    },
    layout() {
      return {
        title: "Wing",
        font: { size: 18 },
        height: window.innerWidth > 960 ? 600 : window.innerHeight * 0.5,
        width: window.innerWidth > 960 ? 600 : window.innerWidth * 0.9,
        margin: {
          l: 65,
          r: 10,
          b: 100,
          t: 100,
          pad: 4,
        },
        yaxis: {
          scaleanchor: "x",
          scaleratio: 1,
          title: {
            text: "[m]",
            font: { size: 16 },
          },
        },
        xaxis: {
          title: {
            text: "[m]",
            font: { size: 16 },
          },
        },
        dragmode: false,
      };
    },
  },
  mounted() {
    Plotly.newPlot("wing-plot", [this.trace1]);
  },
  watch: {
    trace1() {
      Plotly.react("wing-plot", [this.trace1]);
    },
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
.form .field {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.25rem;
}
input {
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 2rem;
}
label {
  margin: 0.25rem 0;
  font-weight: 700;
  text-align: left;
}
</style>
