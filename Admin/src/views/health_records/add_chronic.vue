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
  <div class="modal" id="modal-addchrno">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Tạo Hồ Sơ Bệnh Mãn Tính</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Tên Bệnh Mãn Tính(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                required
              >
                <option value="Bệnh Tim Mạch">Bệnh Tim Mạch</option>
                <option value="Bệnh Phổi Mãn Tính">Bệnh Phổi Mãn Tính</option>
                <option value="Tim Bẩm Sinh">Tim Bẩm Sinh</option>
                <option value="Tăng Huyết Áp">Tăng Huyết Áp</option>
                <option value="Hen Suyễn">Hen Suyễn</option>
                <option value="Tâm Thần">Tâm Thần</option>
                <option value="Đái Tháo Đường">Đái Tháo Đường</option>
                <option value="Bệnh Bứu Cổ">Bệnh Bứu Cổ</option>
                <option value="Bệnh Viêm Khớp">Bệnh Viêm Khớp</option>
                <option value="Ung Thư">Ung Thư</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="form-group">
              <label for="diagnosis_date"
                >Ngày Phát Hiện(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="diagnosis_date"
                name="diagnosis_date"
                v-model="item.diagnosis_date"
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
              <label for="current_status"
                >Tình Trạng Hiện Tại(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="current_status"
                name="current_status"
                v-model="item.current_status"
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
