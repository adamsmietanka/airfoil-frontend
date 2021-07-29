<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="input-append">
      <input
        type="number"
        id="id"
        :value="value"
        @input="setValue($event.target.value)"
      />
      <div class="unit">{{ unit }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NumberField",
  props: {
    label: String,
    value: Number,
    setter: Function,
    unit: String,
  },
  data() {
    return {
      timeout: null,
    };
  },
  methods: {
    setValue(val) {
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setter(val);
      }, 500);
    },
  },
  computed: {
    id() {
      return this.label.toLowerCase().split(" ").join("-");
    },
  },
};
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}
label {
  margin: 0.25rem 0;
  font-weight: 700;
  text-align: left;
}
.input-append {
  position: relative;
  height: 2rem;
}
input {
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  padding-left: 0.5rem;
}
input:focus {
  border-width: 1px;
}
.unit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 0 4px 4px 0;
  background: #eee;
  font-weight: 900;
}
</style>
