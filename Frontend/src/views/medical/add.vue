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
    const medications = reactive([
      {
        name: "",
        frequency: "",
        doses: "",
        note: "",
      },
    ]);

    const create = () => {
      // Tạo một bản sao của mảng medications
      const medicationsCopy = medications.map((medication) => ({
        ...medication,
      }));

      // Gửi bản sao của mảng medications lên component cha
      ctx.emit("create", medicationsCopy);
      console.log("Thêm Thành Công");
    };

    const addMedication = () => {
      medications.push({
        name: "",
        frequency: "",
        doses: "",
        note: "",
      });
    };

    return {
      medications,
      create,
      addMedication,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addmedi">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm Đơn Thuốc</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>
        <!-- ... Modal content ... -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div v-for="(medication, index) in medications" :key="index">
              <div class="form">
                <div class="readd">
                  <span
                    class="material-symbols-outlined"
                    @click="addMedication"
                  >
                    add
                  </span>
                </div>
                <div class="readd" @click="medications.splice(index, 1)">
                  <span class="material-symbols-outlined"> remove </span>
                </div>
                <div class="form-group">
                  <label for="name"
                    >Tên Thuốc(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :id="'name' + index"
                    :name="'name' + index"
                    v-model="medication.name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="frequency"
                    >Tần Suất(<span style="color: red">*</span>):</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    :id="'frequency' + index"
                    :name="'frequency' + index"
                    v-model="medication.frequency"
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
                    :id="'doses' + index"
                    :name="'doses' + index"
                    v-model="medication.doses"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="note">Ghi Chú:</label>
                  <input
                    type="text"
                    class="form-control"
                    :id="'note' + index"
                    :name="'note' + index"
                    v-model="medication.note"
                  />
                </div>
              </div>
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
.form {
  border: 1px solid var(--gray);
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
}
.readd {
  float: right;
  cursor: pointer;
}
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
.modal-body {
  max-height: 600px;
  overflow-y: scroll;
}
</style>
