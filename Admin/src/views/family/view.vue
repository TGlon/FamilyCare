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
              Thông tin cá nhân
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
                        <span class="font-weight-bold">Họ Tên:</span>
                        {{ item.name }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Giới Tính:</span>
                        {{ item.gender }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Ngày Sinh:</span>
                        {{ item.birthday }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Địa Chỉ:</span>
                        {{ item.address }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">SĐT:</span>
                        {{ item.phone }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Quốc Tịch:</span>
                        {{ item.nation }}
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <p class="mb-0">
                        <span class="font-weight-bold">CMND/CCCD:</span>
                        {{ item.passport }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Mã Định Danh:</span>
                        {{ item.digital_identity }}
                      </p>
                      <p class="mb-0">
                        <span class="font-weight-bold">Bảo Hiểm:</span>
                        {{ item.insurance }}
                      </p>

                      <p class="mb-0">
                        <span class="font-weight-bold">Email:</span>
                        {{ item.email }}
                      </p>
                      <!-- <p class="mb-0">
                        <span class="font-weight-bold">Quốc Tịch:</span>
                        {{ item.nation }}
                      </p> -->
                      <p class="mb-0">
                        <span class="font-weight-bold">Dân Tộc:</span>
                        {{ item.ethnic }}
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
              Thông Tin Sức Khỏe
            </button>
            <div
              v-if="isActive"
              id="medicine-info"
              class="collapse my-2 border-all"
            >
              <div class="container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Ngày Ghi Nhận</th>
                      <th>Chiều Cao</th>
                      <th>Cân Nặng</th>
                      <th>Huyết Áp</th>
                      <th>Nhịp Tim</th>
                      <th>Nhóm Máu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in filteredHealthItems" :key="item._id">
                      <td>{{ item.recording_date }}</td>
                      <td>{{ item.height }}</td>
                      <td>{{ item.weight }}</td>
                      <td>{{ item.blood_pressure }}</td>
                      <td>{{ item.heart_rate }}</td>
                      <td>{{ item.blood_type }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#medical-info"
              style="margin-bottom: 0"
              @click="togglePersonalInfo"
            >
              Tiền Sử Bệnh Tật
            </button>
            <div
              v-if="isActive"
              id="medical-info"
              class="collapse my-2 border-all"
            >
              <div class="container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Chuẩn Đoán</th>
                      <th>Ngày Chuẩn Đoán</th>
                      <th>Tình Trạng Hiện Tại</th>
                      <th>Bác Sĩ</th>
                      <th>Ghi Chú</th>
                      <th>Đơn Thuốc</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="itemMedi in filteredMediItems"
                      :key="itemMedi._id"
                    >
                      <td>{{ itemMedi.diagnosis }}</td>
                      <td>{{ itemMedi.Appointment.start_date }}</td>
                      <td>{{ itemMedi.medical_condition }}</td>
                      <td>{{ itemMedi.doctor }}</td>
                      <td>{{ itemMedi.note }}</td>
                      <td>
                        <span
                          class="material-symbols-outlined"
                          style="cursor: pointer"
                          @click="showMedicine(itemMedi._id)"
                        >
                          prescriptions
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#Vaccination-info"
              style="margin-bottom: 0"
              @click="togglePersonalInfo"
            >
              Lịch Sử Tiêm Ngừa
            </button>
            <div
              v-if="isActive"
              id="Vaccination-info"
              class="collapse my-2 border-all"
            >
              <div class="container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Tiêm Ngừa</th>
                      <th>Loại Tiêm Ngừa</th>
                      <th>Vaccine</th>
                      <th>Ngày Tiêm</th>
                      <th>Liều Lượng</th>
                      <th>Bác Sĩ</th>
                      <th>Ghi Chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="itemVacc in filteredVaccinationItems"
                      :key="itemVacc._id"
                    >
                      <td>{{ itemVacc.vaccination }}</td>
                      <td>{{ itemVacc.Vaccine_Type.name }}</td>
                      <td>{{ itemVacc.vaccine }}</td>
                      <td>{{ itemVacc.Appointment.start_date }}</td>
                      <td>{{ itemVacc.doses }}</td>
                      <td>{{ itemVacc.doctor }}</td>
                      <td>{{ itemVacc.note }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#Allergy-info"
              style="margin-bottom: 0"
              @click="togglePersonalInfo"
            >
              Thông Tin Dị Ứng 
            </button>
            <div
              v-if="isActive"
              id="Allergy-info"
              class="collapse my-2 border-all"
            >
              <div class="container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Loại Dị Ứng</th>
                      <th>Ngày Phát Hiện</th>
                      <th>Mức Độ</th>
                      <th>Bác Sĩ Chuẩn Đoán</th>
                      <th>Mô Tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="itemAllergy in filteredAllergyItems"
                      :key="itemAllergy._id"
                    >
                      <td>{{ itemAllergy.allergy_type }}</td>
                      <td>{{ itemAllergy.detection_date}}</td>
                      <td>{{ itemAllergy.severity }}</td>
                      <td>{{ itemAllergy.doctor }}</td>
                      <td>{{ itemAllergy.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <button
              data-toggle="collapse"
              class="px-3 py-2 h6 border-none"
              data-target="#chronic-info"
              style="margin-bottom: 0"
              @click="togglePersonalInfo"
            >
              Thông Tin Bệnh Mãn Tính 
            </button>
            <div
              v-if="isActive"
              id="chronic-info"
              class="collapse my-2 border-all"
            >
              <div class="container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Tên Bệnh</th>
                      <th>Ngày Chuẩn Đoán</th>
                      <th>Bác Sĩ Chuẩn Đoán</th>
                      <th>Tình Trạng Hiện Tại</th>
                      <th>Mô Tả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="itemChronic in filteredChronicItems"
                      :key="itemChronic._id"
                    >
                      <td>{{ itemChronic.name }}</td>
                      <td>{{ itemChronic.diagnosis_date}}</td>
                      <td>{{ itemChronic.doctor }}</td>
                      <td>{{ itemChronic.current_status }}</td>
                      <td>{{ itemChronic.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { ref, watch, reactive, computed } from "vue";
import { http_getAll } from "../../assets/js/common.http";
import Health_Statistics from "../../services/health_statistics.service";
import Medical from "../../services/medical.service";
import Vaccination_History from "../../services/vaccination.service";
import Medicine from "../../services/medicine.service";
import Allergy from "../../services/allergy.services";
import Chronic from "../../services/chronic.service";
import { alert_medicine } from "../../assets/js/common.alert";
export default {
  props: {
    item: {
      type: Object,
    },
  },
  setup(props) {
    const isActive = ref(false);
    const data = reactive({
      HealthItem: [],
      MedicalItem: [],
      VaccinationItem: [],
      medicineItem: [],
      allergyItem: [],
      chronicItem: []
    });

    const togglePersonalInfo = () => {
      isActive.value = !isActive.value;
    };

    const refresh = async () => {
      data.HealthItem = await http_getAll(Health_Statistics);
      data.MedicalItem = await http_getAll(Medical);
      data.VaccinationItem = await http_getAll(Vaccination_History);
      data.medicineItem = await http_getAll(Medicine);
      data.allergyItem = await http_getAll(Allergy);
      data.chronicItem = await http_getAll(Chronic);
        // console.log(data.allergyItem);
    };

    onMounted(async () => {
      await refresh();
    });

    const itemId = ref(props.item._id);
    const latestItemId = computed(() => itemId.value);

    const filteredHealthItems = computed(() => {
      return data.HealthItem.filter(
        (user) => user.UserId === latestItemId.value
      );
    });
    const filteredAllergyItems = computed(() => {
      return data.allergyItem.filter(
        (user) => user.UserId === latestItemId.value
      );
    });
    const filteredChronicItems = computed(() => {
      return data.chronicItem.filter(
        (user) => user.UserId === latestItemId.value
      );
    });
    const filteredMediItems = computed(() => {
      return data.MedicalItem.filter(
        (medi) =>
          medi.Appointment && medi.Appointment.UserId === latestItemId.value
      );
    });
    const filteredVaccinationItems = computed(() => {
      return data.VaccinationItem.filter(
        (vacc) =>
          vacc.Appointment && vacc.Appointment.UserId === latestItemId.value
      );
    });
    
    watch(
      () => props.item,
      (newItem) => {
        itemId.value = newItem._id;
      }
    );
    const showMedicine = (itemId) => {
      const filteredMedicineItems = data.medicineItem.filter(
        (medicine) => medicine.MedicalHistoryId === itemId
      );

      const medicineDetails = filteredMedicineItems.map((medicineItem) => {
        const { name, frequency, doses, note } = medicineItem;
        return { name, frequency, doses, note };
      });
      alert_medicine(medicineDetails);
      // Do something with medicineDetails, for example, log it
      //   console.log(medicineDetails);
    };
    return {
      isActive,
      togglePersonalInfo,
      data,
      filteredHealthItems,
      filteredMediItems,
      filteredVaccinationItems,
      filteredAllergyItems,
      filteredChronicItems,
      showMedicine,
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
