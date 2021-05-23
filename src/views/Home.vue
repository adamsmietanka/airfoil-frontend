<template>
  <div class="layout">
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
  </div>
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
          0,
          -(Math.tan((this.angle * Math.PI) / 180) * this.span) / 2,
          -(Math.tan((this.angle * Math.PI) / 180) * this.span) / 2 -
            this.chord_tip,
          -this.chord_fuse,
          0,
        ],
        type: "scatter",
      };
    },
    layout() {
      return {
        title: "Wing contour",
        font: { size: 16 },
        height: 400,
        width: 600,
        margin: {
          l: 100,
          r: 10,
          b: 100,
          t: 50,
          pad: 4,
        },
        yaxis: {
          scaleanchor: "x",
          scaleratio: 1,
          title: {
            text: "[m]",
            font: { size: 12 },
            standoff: 5,
          },
        },
        xaxis: {
          title: {
            text: "[m]",
            font: { size: 12 },
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
.layout {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.form {
  display: flex;
  flex-direction: column;
  width: 250px;
}
</style>
