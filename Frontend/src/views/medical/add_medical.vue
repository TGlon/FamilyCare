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
    const create = () => {
      ctx.emit("create1");
      console.log("Thêm Thành Công");
    };
    return {
      create,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addmedicalhistory">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Tạo Lịch Sử Khám Bệnh
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="diagnosis"
                >Chuẩn Đoán(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="diagnosis"
                name="diagnosis"
                v-model="item.diagnosis"
                required
              />
            </div>
            <div class="form-group">
              <label for="medical_condition"
                >Tình Trạng Sức Khỏe(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="medical_condition"
                name="medical_condition"
                v-model="item.medical_condition"
                required
              />
            </div>
            <div class="form-group">
              <label for="doctor"
                >Bác Sĩ Chuẩn Đoán(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="doctor"
                name="doctor"
                v-model="item.doctor"
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
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="add"
            >
              <span>Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#add {
    float: right;
}
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
</style>
