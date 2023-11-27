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
        props.item.vaccine.length > 0 &&
        props.item.doses.length > 0 &&
        props.item.doctor.length > 0 &&
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
            Sửa Thông Tin Tiêm Ngừa
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
              <label for="vaccination"
                >Tiêm Ngừa(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="vaccination"
                name="vaccination"
                v-model="item.vaccination"
                required
              />
            </div>
            <div class="form-group">
              <label for="vaccine"
                >Tên Vaccine(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="vaccine"
                name="vaccine"
                v-model="item.vaccine"
                required
              />
            </div>
            <div class="form-group">
              <label for="doses"
                >Liều Lượng(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="doses"
                name="doses"
                v-model="item.doses"
                required
              />
            </div>
            <div class="form-group">
              <label for="doctor"
                >Bác Sĩ(<span style="color: red">*</span>):</label
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
