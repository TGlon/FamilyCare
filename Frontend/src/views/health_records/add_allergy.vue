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
      ctx.emit("create");
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
  <div class="modal" id="modal-addalle">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Tạo Hồ Sơ Dị Ứng</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="allergy_type"
                >Loại Dị Ứng(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="allergy_type"
                name="allergy_type"
                v-model="item.allergy_type"
                required
              >
                <option value="Thuốc">Thuốc</option>
                <option value="Hóa Chất/ Mỹ Phẩm">Hóa chất/ Mỹ phẩm</option>
                <option value="Thực Phẩm">Thực phẩm</option>
                <option value="Đường Hô Hấp">Đường hô hấp</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="form-group">
              <label for="detection_date"
                >Ngày Phát Hiện(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="detection_date"
                name="detection_date"
                v-model="item.detection_date"
                required
              />
            </div>
            <div class="form-group">
              <label for="severity"
                >Mức Độ(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="severity"
                name="severity"
                v-model="item.severity"
                required
              >
                <option value="Nhẹ">Nhẹ (ít khó chịu như ngứa, ho, ...)</option>
                <option value="Trung Bình">Trung Bình (khá khó chịu)</option>
                <option value="Nặng">Nặng (khó thở cấp tính, sưng nặng, ...)</option>
                <option value="Sốc Phản Vệ">Sốc Phản Vệ (nguy hiểm đến tính mạng)</option>
              </select>
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
              <label for="description"
                >Mô Tả(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="description"
                name="description"
                v-model="item.description"
                required
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
