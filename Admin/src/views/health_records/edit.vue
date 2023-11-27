<script>
import { reactive } from "vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const update = () => {
      if (
        props.item.recording_date.length > 0 &&
        props.item.weight.length > 0 &&
        props.item.height.length > 0 &&
        props.item.heart_rate.length > 0 &&
        props.item.blood_pressure.length > 0 &&
        props.item.blood_type.length > 0 
      ) {
        ctx.emit("update");
      }
    };
    return {
      update,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="model-edithealth">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Sửa Thông Tin Sức Khỏe
          </h4>
          <button
            @click="$emit('cancel')"
            type="button"
            class="close"
            data-dismiss="modal"
          >
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="recording_date"
                >Ngày Ghi Nhận(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="recording_date"
                name="recording_date"
                v-model="item.recording_date"
                required
              />
            </div>
            <div class="form-group">
              <label for="weight"
                >Cân Nặng(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="weight"
                name="weight"
                v-model="item.weight"
                required
              />
            </div>
            <div class="form-group">
              <label for="height"
                >Chiều Cao(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="height"
                name="height"
                v-model="item.height"
                required
              />
            </div>
            <div class="form-group">
              <label for="blood_type"
                >Nhóm Máu(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="blood_type"
                name="blood_type"
                v-model="item.blood_type"
                required
              />
            </div>
            <div class="form-group">
              <label for="heart_rate"
                >Nhịp Tim(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="heart_rate"
                name="heart_rate"
                v-model="item.heart_rate"
                required
              />
            </div>
            <div class="form-group">
              <label for="blood_pressure"
                >Huyết Áp(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="blood_pressure"
                name="blood_pressure"
                v-model="item.blood_pressure"
                required
              />
            </div>

            <button
              type="button"
              class="btn btn-warning px-3 py-2"
              style="font-size: 14px; float: right"
              @click="$emit('edit')"
              id="edit"
            >
              <span>Cập Nhật</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS để bố trí radio button và label ngang hàng */
.gender-options {
  display: flex;
  align-items: center;
}

.gender-options input[type="radio"] {
  margin-right: 1px; /* Khoảng cách giữa radio button và label */
  width: 50px;
  height: 20px;
}

.gender-options label {
  margin-right: 50px; /* Khoảng cách giữa các label */
  display: flex;
  align-items: center;
}
.show-modal {
  display: block;
  opacity: 1;
  pointer-events: auto;
}
</style>
