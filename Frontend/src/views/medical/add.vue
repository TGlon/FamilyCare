<script>
import { reactive, ref, onBeforeMount } from "vue";
import { http_getAll } from "../../assets/js/common.http";
import Medicinee from "../../services/medicine.service";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      items: [],
    });
    const medications = reactive([
      {
        name: "",
        frequency: "",
        doses: "",
        note: "",
      },
    ]);
    const numRows = ref(1); // Biến để theo dõi số lượng hàng trong bảng

    const create = () => {
      const medicationsCopy = medications.map((medication) => ({
        ...medication,
      }));
      ctx.emit("create", medicationsCopy);
      console.log("Thêm Thành Công");
    };

    const addRow = () => {
      numRows.value++;
      medications.push({
        name: "",
        frequency: "",
        doses: "",
        note: "",
      });
    };

    const removeRow = (index) => {
      numRows.value--;
      medications.splice(index, 1);
    };
    const refresh = async () => {
      data.items = await http_getAll(Medicinee);
      // console.log("data nè", data.items);
    };
    onBeforeMount(async () => {
      refresh();
    });
    return {
      data,
      medications,
      numRows,
      create,
      addRow,
      removeRow,
    };
  },
};
</script>

<template>
  <div class="modal" id="modal-addmedi" >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm Đơn Thuốc</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <form action="" class="was-validated">
            <table>
              <thead>
                <tr>
                  <th>Tên Thuốc (<span style="color: red">*</span>)</th>
                  <th>Thời Điểm (<span style="color: red">*</span>)</th>
                  <th>Liều Lượng (<span style="color: red">*</span>)</th>
                  <th>Số Lượng (<span style="color: red">*</span>)</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(medication, index) in medications" :key="index">
                  <!-- <td>
                    <select
                      class="form-control"
                      :id="'name' + index"
                      :name="'name' + index"
                      v-model="medication.name"
                      required
                    >
                      <option value="" disabled>Chọn tên thuốc</option>
                      <option
                        v-for="item in data.items"
                        :key="item._id"
                        :value="item.name"
                      >
                        {{ item.name }}
                      </option>
                    </select>
                  </td> -->
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :id="'name' + index"
                      :name="'name' + index"
                      v-model="medication.name"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :id="'frequency' + index"
                      :name="'frequency' + index"
                      v-model="medication.frequency"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :id="'doses' + index"
                      :name="'doses' + index"
                      v-model="medication.doses"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      :id="'note' + index"
                      :name="'note' + index"
                      v-model="medication.note"
                      required
                    />
                  </td>
                  <td>
                    <span
                      class="material-symbols-outlined"
                      style="cursor: pointer"
                      @click="removeRow(index)"
                    >
                      remove
                    </span>
                    <span
                      style="cursor: pointer"
                      class="material-symbols-outlined"
                      @click="addRow"
                      id="add"
                      >add</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="addRow"
              id="add"
            >
              <span>+</span>
            </button> -->
            <button
              type="button"
              class="btn btn-primary px-3 py-2 mt-2 mr-2"
              style="font-size: 14px; float: right"
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
table {
  border: 1px solid var(--gray);
  width: 750px;
  margin-left: 8px;
  border-collapse: collapse;
  font-size: 14px;
}
th,
td {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
}
thead {
  background-color: white;
  color: black;
}
input {
  border: 0px;
}

.modal-dialog {
  max-width: 800px; /* Đặt chiều rộng tối đa của modal-dialog */
}
</style>
