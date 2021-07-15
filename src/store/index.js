import { createStore } from "vuex";

export default createStore({
  state: {
    span: 10,
  },
  mutations: {
    SET_SPAN(state, span) {
      state.span = parseFloat(span);
    },
  },
});
