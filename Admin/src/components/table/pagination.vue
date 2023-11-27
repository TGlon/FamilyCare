<script>
import { inject } from "vue";
export default {
  props: {
    totalRow: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    numberOfPages: {
      type: Number,
      default: 10,
    },
    startRow: {
      type: Number,
      default: 0,
    },
    endRow: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const emit = inject("emit");
    const updateCurrentPage = (number) => {
      ctx.emit("update:currentPage", number);
      // Tính toán lại startRow và endRow khi chuyển trang
      const newStartRow = (number - 1) * props.numberOfPages + 1;
      const newEndRow = Math.min(number * props.numberOfPages, props.totalRow);
      ctx.emit("update:startRow", newStartRow);
      ctx.emit("update:endRow", newEndRow);
    };
    const updateNextPage = (number) => {
      if (number < props.numberOfPages && number > 0) {
        ctx.emit("update:currentPage", number + 1);
      }
    };
    const updatePrevPage = (number) => {
      if (number <= props.numberOfPages && number > 1) {
        ctx.emit("update:currentPage", number - 1);
      }
    };
    return {
      updateCurrentPage,
      updateNextPage,
      updatePrevPage,
    };
  },
};
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mt-2">
    <p>
      Hiển thị từ {{ totalRow == 0 ? 0 : startRow }} đến
      {{ endRow > totalRow ? totalRow : endRow }} của {{ totalRow }} bản ghi
    </p>
    <ul class="pagination">
      <li @click="updatePrevPage(currentPage)" class="page-item">
        <a class="page-link text-dark" href="#">Trang Trước</a>
      </li>
      <li
        @click="updateCurrentPage(value)"
        v-for="(value, index) in numberOfPages" :key="index"
        class="page-item"
      >
        <a
          class="page-link"
          :class="[index == currentPage - 1 ? 'text-blue' : 'text-dark']"
          href="#"
          >{{ value }}</a
        >
      </li>
      <li @click="updateNextPage(currentPage)" class="page-item">
        <a class="page-link text-dark" href="#">Trang Tiếp</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pagination-css {
  display: flex;
}
.page-link {
  border: 1px solid var(--gray);
  border-collapse: collapse;
  padding: 8px 12px;
  background-color: inherit;
  font-size: 14px;
}
.text-dark {
  color: var(--dark);
}
.text-blue {
  color: blue;
}
</style>