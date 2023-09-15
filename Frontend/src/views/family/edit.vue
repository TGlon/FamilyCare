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
        props.item.name.length > 0 &&
        props.item.insurance.length > 0 &&
        props.item.birthday.length > 0 &&
        props.item.phone.length > 0 &&
        props.item.passport.length > 0 &&
        props.item.gender.length > 0 &&
        props.item.relationship.length > 0
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
              <label for="name"
                >Tên Thành Viên(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                required
              />
            </div>
            <div class="form-group">
              <label for="insurance"
                >Mã Y Tế(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="insurance"
                name="insurance"
                v-model="item.insurance"
                required
              />
            </div>
            <div class="form-group">
              <label for="birthday"
                >Ngày Sinh(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="birthday"
                name="birthday"
                v-model="item.birthday"
                required
              />
            </div>
            <div class="form-group">
              <label for="passport"
                >CCCD/CMND(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="passport"
                name="passport"
                v-model="item.passport"
                required
              />
            </div>
            <div class="form-group">
              <label for="gender"
                >Giới Tính(<span style="color: red">*</span>):</label
              >
              <div class="gender-options">
                <input
                  type="radio"
                  class="form-control"
                  id="gender-nam"
                  name="gender"
                  value="Nam"
                  v-model="item.gender"
                  required
                />
                <label for="gender-nam">Nam</label>

                <input
                  type="radio"
                  class="form-control"
                  id="gender-nu"
                  name="gender"
                  value="Nữ"
                  v-model="item.gender"
                  required
                />
                <label for="gender-nu">Nữ</label>

                <input
                  type="radio"
                  class="form-control"
                  id="gender-khac"
                  name="gender"
                  value="Khác"
                  v-model="item.gender"
                  required
                />
                <label for="gender-khac">Khác</label>
              </div>
            </div>
            <div class="form-group">
              <label for="phone"
                >Số Điện Thoại(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="phone"
                name="phone"
                v-model="item.phone"
                required
              />
            </div>
            <div class="form-group">
              <label for="relationship"
                >Mối Quan Hệ(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="relationship"
                name="relationship"
                v-model="item.relationship"
                required
              >
                <option value="Chủ Hộ" selected>Chủ Hộ</option>
                <option value="Con">Con</option>
                <option value="Vợ">Vợ</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Bố">Bố</option>
                <option value="Em">Em</option>
                <option value="Anh">Anh</option>
                <option value="Chị">Chị</option>
                <option value="Khác">Khác</option>
              </select>
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
