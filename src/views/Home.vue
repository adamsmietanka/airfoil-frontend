<template>
  <section>
    <div class="form">
      <NumberField id="span" label="Span" v-model="span" unit="m" />
      <!--      TODO: add radio wing type choice-->
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
      <select v-model="selected_airfoil" >
        <option v-for="airfoil in airfoils" :key="airfoil">
          {{ airfoil }}
        </option>
      </select>
      <span>Selected: {{ selected_airfoil }}</span>
    </div>
    <div id="wing-plot"></div>
  </section>
</template>

<script>
import axios from "axios";
import Plotly from "plotly.js-gl3d-dist-min";
import NumberField from "@/components/NumberField";

export default {
  name: "Home",
  components: { NumberField },
  data() {
    return {
      profile: [
        [0, 1, 0],
        [0, 0, 0],
      ],
      airfoils: ["Select 1", "Select 2", "Select 3"],
    };
  },
  computed: {
    span: {
      get() {
        return this.$store.state.span;
      },
      set(value) {
        this.$store.commit("SET_SPAN", value);
      },
    },
    chord_fuse: {
      get() {
        return this.$store.state.chord_fuse;
      },
      set(value) {
        return this.$store.commit("SET_CHORD_FUSE", value);
      },
    },
    chord_tip: {
      get() {
        return this.$store.state.chord_tip;
      },
      set(value) {
        return this.$store.commit("SET_CHORD_TIP", value);
      },
    },
    angle: {
      get() {
        return this.$store.state.angle;
      },
      set(value) {
        return this.$store.commit("SET_ANGLE", value);
      },
    },
    selected_airfoil: {
      get() {
        return this.$store.state.selected_airfoil;
      },
      set(value) {
        return this.$store.commit("SET_AIRFOIL", value);
      },
    },
    tip_trailing() {
      return (
        -(Math.tan((this.angle * Math.PI) / 180) * this.span) / 2 -
        this.chord_tip
      );
    },
    tip_leading() {
      return -(Math.tan((this.angle * Math.PI) / 180) * this.span) / 2;
    },
    leading() {
      return {
        x: [...Array(11).keys()].map((x) => (x * this.tip_leading) / 10),
        y: [...Array(11).keys()].map((y) => (y * this.span) / 2 / 10),
        z: Array(11).fill(0),
        type: "scatter3d",
        mode: "lines",
      };
    },
    trailing() {
      return {
        x: [...Array(11).keys()].map(
          (x) =>
            (x * (this.chord_fuse + this.tip_trailing)) / 10 - this.chord_fuse
        ),
        y: [...Array(11).keys()].map((y) => (y * this.span) / 2 / 10),
        z: Array(11).fill(0),
        type: "scatter3d",
        mode: "lines",
      };
    },
    section_fuse() {
      return {
        x: this.profile[0].map((x) => x * -this.chord_fuse),
        y: Array(this.profile[0].length).fill(0),
        z: this.profile[1].map((z) => z * this.chord_fuse),
        type: "scatter3d",
        mode: "lines",
      };
    },
    section_tip() {
      return {
        x: this.profile[0].map((x) => x * -this.chord_tip + this.tip_leading),
        y: Array(this.profile[0].length).fill(this.span / 2),
        z: this.profile[1].map((z) => z * this.chord_tip),
        type: "scatter3d",
        mode: "lines",
      };
    },
    traces() {
      return [this.leading, this.trailing, this.section_fuse, this.section_tip];
    },
    layout() {
      return {
        title: "Wing contour",
        showlegend: false,
        font: { size: 12 },
        height: 600,
        width: 1000,
        margin: {
          l: 100,
          r: 10,
          b: 100,
          t: 50,
          pad: 4,
        },
        scene: {
          aspectmode: "manual",
          aspectratio: {
            x: 1,
            y: this.span / 2 / Math.max(this.chord_fuse, -this.tip_trailing),
            z:
              (this.chord_fuse *
                (Math.max(...this.profile[1]) - Math.min(...this.profile[1]))) /
              Math.max(this.chord_fuse, -this.tip_trailing),
          },
        },
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
    Plotly.newPlot("wing-plot", this.traces, this.layout, this.options);
  },
  created() {
    axios.get("http://localhost:5000/airfoils").then((res) => {
      this.airfoils = res.data;
    });
    axios
      .get("http://localhost:5000/airfoil", {
        params: { airfoil: this.selected_airfoil },
      })
      .then((res) => {
        this.profile = res.data;
      });
  },
  watch: {
    traces() {
      Plotly.react("wing-plot", this.traces, this.layout, this.options);
    },
    selected_airfoil() {
      axios
        .get("http://localhost:5000/airfoil", {
          params: { airfoil: this.selected_airfoil },
        })
        .then((res) => {
          this.profile = res.data;
        });
    },
    profile() {
      Plotly.react("wing-plot", this.traces, this.layout, this.options);
    },
  },
};
</script>

<style scoped>
section {
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
