import { createStore } from "vuex";

export default createStore({
  state: {
    span: 10,
    chord_fuse: 2,
    chord_tip: 1,
    angle: 10,
    selected_airfoil: "test",
  },
  mutations: {
    SET_SPAN(state, span) {
      state.span = parseFloat(span);
    },
    SET_CHORD_FUSE(state, chord_fuse) {
      state.chord_fuse = parseFloat(chord_fuse);
    },
    SET_CHORD_TIP(state, chord_tip) {
      state.chord_tip = parseFloat(chord_tip);
    },
    SET_ANGLE(state, angle) {
      state.angle = parseFloat(angle);
    },
    SET_AIRFOIL(state, selected_airfoil) {
      state.selected_airfoil = selected_airfoil;
    },
  },
});
