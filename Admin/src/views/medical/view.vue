<template>
  <div class="modal" id="model-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 18px">
            Thông tin chi tiết
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#personal-info"
              style="margin-bottom: 0"
              @click="togglePersonalInfo"
            >
              Thông tin bệnh tật
            </button>
            <div
              v-if="isActive"
              id="personal-info"
              class="collapse my-2 border-all"
            >
              <div class="container">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <p class="mb-0">
                        <span class="font-weight-bold">chuẩn đoán: </span
                        >{{ id.diagnosis }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">tình trạng: </span
                        >{{ id.medical_condition }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">bác sĩ: </span
                        >{{ id.doctor }}
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <p class="mb-0">
                        <span class="font-weight-bold">Ghi chú: </span
                        >{{ id.note }}
                      </p>
                    </div>
                    <div class="mb-3">
                      <p class="mb-0">
                        <span class="font-weight-bold">ngày chuẩn đoán: </span
                        >{{ id.start_date }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#medicine-info"
              style="margin-bottom: 0"
              @click="togglePersonalInfo"
            >
              Đơn Thuốc
            </button>
            <div
              v-if="isActive"
              id="medicine-info"
              class="collapse my-2 border-all"
            >
              <button
                class="px-2 py-2 h6 btn btn-outline-info"
                style="margin-top: 5px; float: right; margin-right: 5px"
                @click="openEditMedicineModal"
              >
                Sửa đơn thuốc
              </button>
              <div class="container">
                <Table
                  :items="medicineData"
                  :fields="medicineFields"
                  :labels="medicineLabels"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import Table from "../../components/table/tbl_view.vue";
import Medicinee from "../../services/medicine.service";
import { http_getAllByMedicalHistoryId } from "../../assets/js/common.http";
export default {
  props: {
    id: {
      type: Object,
    },
  },
  components: {
    Table,
  },
  setup(props) {
    const isActive = ref(false);
    // const medicineData = [
    //   {
    //     name: "Medicine 1",
    //     frequency: "Once daily",
    //     doses: "2 pills",
    //     note: "Take with food",
    //   },
    //   {
    //     name: "Medicine 2",
    //     frequency: "Twice daily",
    //     doses: "1 pill",
    //     note: "Before bedtime",
    //   },
    //   // Add more medicine objects as needed
    // ];
    const medicineData = ref([]); // Khởi tạo medicineData là một mảng rỗng
    const activeId = ref(null);
    watch(
      () => props.id,
      async (newId) => {
        activeId.value = newId;
        console.log(activeId.value._id);

        // Gọi hàm để lấy dữ liệu và gán cho medicineData
        medicineData.value = await http_getAllByMedicalHistoryId(
          Medicinee,
          activeId.value._id
        );
        console.log(medicineData.value);
      }
    );
    const togglePersonalInfo = () => {
      isActive.value = !isActive.value;
    };
    // Định nghĩa các trường (fields) và nhãn (labels) cho bảng thuốc
    const medicineLabels = ["name", "frequency", "doses", "note"];
    const medicineFields = {
      name: "Tên thuốc",
      frequency: "Thời điểm",
      doses: "Liều lượng",
      note: "Ghi chú",
    };

    
    return {
      isActive,
      togglePersonalInfo,
      medicineFields,
      medicineLabels,
      medicineData,
      activeId,
    };
  },
};
</script>

<style scoped>
.border-none {
  outline: none;
  border: none;
}

.border-all {
  border: 1px solid #ccc;
  border-radius: 5px;
}

@media screen and (min-width: 739px) and (max-width: 992px) {
  .modal-content {
    width: 200%;
    margin-left: -50%;
  }
}
</style>
