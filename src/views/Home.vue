<template>
  <div class="form">
    <NumberField id="span" label="Span" v-model="span" unit="m" />
    <NumberField
      id="chord-fuse"
      label="Fuselage chord"
      v-model="chord_fuse"
      unit="m"
    />
    <NumberField
      id="chord-tip"
      label="Tip Chord"
      v-model="chord_tip"
      unit="m"
    />
    <NumberField id="angle" label="Angle" v-model="angle" unit="º" />
  </div>
  <div id="wing-plot"></div>
</template>

<script>
import Plotly from "plotly.js-gl3d-dist-min";
import NumberField from "@/components/NumberField";

export default {
  name: "Home",
  components: { NumberField },
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
    options() {
      return {
        scrollZoom: false,
        responsive: true,
        modeBarButtons: [["toImage"]],
        toImageButtonOptions: {
          format: "png",
          filename: "engine_power",
        },
      };
    },
  },
  mounted() {
    Plotly.newPlot("wing-plot", [this.trace1], this.layout, this.options);
  },
  watch: {
    trace1() {
      Plotly.react("wing-plot", [this.trace1], this.layout, this.options);
    },
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
}
</style>
