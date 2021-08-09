<template>
  <section>
    <div class="form">
      <NumberField label="Span" :value="span" :setter="SET_SPAN" unit="m" />
      <!--      TODO: add radio wing type choice-->
      <NumberField
        label="Fuselage chord"
        :value="chord_fuse"
        :setter="SET_CHORD_FUSE"
        unit="m"
      />
      <NumberField
        label="Tip Chord"
        :value="chord_tip"
        :setter="SET_CHORD_TIP"
        unit="m"
      />
      <NumberField label="Angle" :value="angle" :setter="SET_ANGLE" unit="º" />
      <select v-model="selected_airfoil">
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
import { mapMutations, mapState } from "vuex";

export default {
  name: "Home",
  components: { NumberField },
  data() {
    return {
      profile: [
        [0, 1, 0],
        [0, 0, 0],
      ],
      airfoils: [],
    };
  },
  methods: {
    ...mapMutations([
      "SET_SPAN",
      "SET_CHORD_FUSE",
      "SET_CHORD_TIP",
      "SET_ANGLE",
    ]),
  },
  computed: {
    ...mapState({
      span: (state) => state.wing.span,
      chord_tip: (state) => state.wing.chord_tip,
      chord_fuse: (state) => state.wing.chord_fuse,
      angle: (state) => state.wing.angle,
    }),
    selected_airfoil: {
      get() {
        return this.$store.state.wing.selected_airfoil;
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
  async created() {
    const choices = await axios.get("http://localhost:5000/airfoils");
    const airfoil = await axios.get("http://localhost:5000/airfoil", {
      params: { airfoil: this.selected_airfoil },
    });
    this.airfoils = choices.data;
    this.profile = airfoil.data;
  },
  watch: {
    traces() {
      Plotly.react("wing-plot", this.traces, this.layout, this.options);
    },
    async selected_airfoil() {
      const airfoil = await axios.get("http://localhost:5000/airfoil", {
        params: { airfoil: this.selected_airfoil },
      });
      this.profile = airfoil.data;
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
