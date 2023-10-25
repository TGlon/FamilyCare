<script>
import { reactive, onBeforeMount } from "vue";
import Vaccine from "../../services/vaccine_service";
import { http_getAll } from "../../assets/js/common.http";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      items: {},
    });
    const create = () => {
      ctx.emit("create");
      console.log("Thêm Thành Công");
    };
    const refresh = async () => {
      data.items = await http_getAll(Vaccine);
      console.log(data.items);
    };
    onBeforeMount(async () => {
      refresh();
    });
    return {
      create,
      data,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addvacc">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Thêm Lịch Sử Tiêm Ngừa
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <!-- <div class="form-group">
              <label for="appointment_type">Loại Cuộc Hẹn:</label>
              <select
                class="form-control"
                id="appointment_type"
                name="appointment_type"
                v-model="item.appointment_type"
                required
              >
                <option value="Khám Bệnh" selected>Khám Bệnh</option>
                <option value="Tiêm Ngừa Covid 19">Tiêm Ngừa Covid 19</option>
                <option value="Tiêm Ngừa Uốn Ván">Tiêm Ngừa Uốn Ván</option>
                <option value="Tiêm Ngừa Viêm Gan">Tiêm Ngừa Viêm Gan</option>
                <option value="Tiêm Ngừa Bệnh Truyền Nhiễm">Tiêm Ngừa Bệnh Truyền Nhiễm</option>
                <option value="Tiêm Ngừa Nhiễm Khuẩn">Tiêm Ngừa Nhiễm Khuẩn</option>
              </select>
            </div> -->

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
              <label for="name"
                >Loại Vaccine(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                required
              >
                <option
                  v-for="vaccineItem in data.items.documents"
                  :value="vaccineItem.name"
                >
                  {{ vaccineItem.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="vaccine"
                >Vaccine(<span style="color: red">*</span>):</label
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
              <label for="note">Ghi Chú:</label>
              <input
                type="text"
                class="form-control"
                id="note"
                name="note"
                v-model="item.note"
              />
            </div>
            <!-- <button type="button" class="btn btn-outline-secondary px-3 py-2">
              <span class="material-symbols-outlined"> mic </span>
            </button> -->
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
