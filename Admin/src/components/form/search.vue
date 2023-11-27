<template>
  <input
    type="text"
    class="form-control"
    placeholder="Tìm kiếm"
    @input="$emit('update:searchText', $event.target.value)"
  />
</template>

<script>
import { reactive } from 'vue';
export default {
  setup() {
    const data = reactive({
        searchText: '',
    });
    return {
        data,
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f8f9fa;
  height: 100vh;
  display: flex;
  align-items: center;
}

.input-group {
  width: 100%;
}
.form-control {
    background-color: inherit;
    border: 1px solid var(--gray);
}
</style>