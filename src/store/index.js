import { createStore } from "vuex";

export default createStore({
  state: {
    wing: {
      span: 10,
      chord_fuse: 2,
      chord_tip: 1,
      angle: 10,
      selected_airfoil: "0009",
    },
  },
  mutations: {
    SET_SPAN(state, span) {
      state.wing.span = parseFloat(span);
    },
    SET_CHORD_FUSE(state, chord_fuse) {
      state.wing.chord_fuse = parseFloat(chord_fuse);
    },
    SET_CHORD_TIP(state, chord_tip) {
      state.wing.chord_tip = parseFloat(chord_tip);
    },
    SET_ANGLE(state, angle) {
      state.wing.angle = parseFloat(angle);
    },
    SET_AIRFOIL(state, selected_airfoil) {
      state.wing.selected_airfoil = selected_airfoil;
    },
  },
});
