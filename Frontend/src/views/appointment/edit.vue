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
        props.item.appointment_type.length > 0 &&
        props.item.start_date.length > 0 &&
        props.item.place.length > 0 &&
        props.item.status.length > 0 &&
        props.item.note.length > 0 
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
  <div class="modal" id="model-edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Sửa Thông Tin Thành Viên
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
              <label for="appointment_type">Loại Cuộc Hẹn:</label>
              <select
                class="form-control"
                id="appointment_type"
                name="appointment_type"
                v-model="item.appointment_type"
              >
              <option value="Khám Bệnh">Khám Bệnh</option>
                <option value="Tiêm Ngừa Covid 19">Tiêm Ngừa Covid 19</option>
                <option value="Tiêm Ngừa Uốn Ván">Tiêm Ngừa Uốn Ván</option>
                <option value="Tiêm Ngừa Viêm Gan">Tiêm Ngừa Viêm Gan</option>
                <option value="Tiêm Ngừa Bệnh Truyền Nhiễm">Tiêm Ngừa Bệnh Truyền Nhiễm</option>
                <option value="Tiêm Ngừa Nhiễm Khuẩn">Tiêm Ngừa Nhiễm Khuẩn</option>
              </select>
            </div>

            <div class="form-group">
              <label for="start_date"
                >Ngày Bắt Đầu(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="start_date"
                name="start_date"
                v-model="item.start_date"
                required
              />
            </div>
            <div class="form-group">
              <label for="place"
                >Địa Điểm(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="place"
                name="place"
                v-model="item.place"
                required
              />
            </div>
            <div class="form-group">
              <label for="status"
                >Trạng Thái(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="status"
                name="status"
                v-model="item.status"
                required
              />
            </div>
            <div class="form-group">
              <label for="note"
                >Ghi Chú:</label
              >
              <input
                type="text"
                class="form-control"
                id="note"
                name="note"
                v-model="item.note"
            
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
