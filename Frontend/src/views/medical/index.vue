<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'Medicals' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Tiền Sử Bệnh Tật</span>
      </router-link>
      <!-- <router-link
        :to="{ name: 'MedicineType' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Thuốc</span>
      </router-link> -->
    </div>
    <!-- Filter -->

    <!-- Search -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 mb-3">
      <div class="d-flex justify-content-start">
        <Select
          class="d-flex justify-content-start"
          :options="[
            {
              name: 5,
              value: 5,
            },
            {
              name: 10,
              value: 10,
            },
            {
              name: 20,
              value: 20,
            },
            {
              name: 30,
              value: 30,
            },
            {
              name: 'All',
              value: 'All',
            },
          ]"
          style="width: 125px"
          :title="`Số bản ghi`"
          @update:entryValue="(value) => (data.entryValue = value)"
          :entryValue="data.entryValue"
          @refresh="(data.entryValue = 'All'), (data.currentPage = 1)"
        />
        <Search
          class="ml-3"
          style="width: 300px"
          @update:searchText="(value) => (data.searchText = value)"
        />
      </div>
      <div class="d-flex align-items-start">
        <button
          type="button"
          class="btn btn-outline-danger"
          data-toggle="modal"
          data-target="#model-delete-all"
          @click="deleteMany()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-outline-primary ml-3"
          data-toggle="modal"
          data-target="#modal-addmedicalhistory"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <AddMedi :item="data.itemAddmedi" @create1="create1" />
        <Add :item="data.itemAdd" @create="create" />
        <AddApp :item="data.itemAddapp" @create2="create2" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Chẩn Đoán',
        'Ngày Chẩn Đoán',
        'Tình Trạng Hiện Tại',
        'Bác Sĩ',
        'Ghi Chú',
      ]"
      :labels="[
        'diagnosis',
        'start_date',
        'medical_condition',
        'doctor',
        'note',
      ]"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (data.editValue = value), (data.activeEdit = value1)
        )
      "
      @medicine="(value) => getId(value)"
      @view="(value) => view(value)"
    />
    <!-- Pagination -->
    <Pagination
      :numberOfPages="data.numberOfPages"
      :totalRow="data.totalRow"
      :startRow="data.startRow"
      :endRow="data.endRow"
      :currentPage="data.currentPage"
      @update:currentPage="(value) => (data.currentPage = value)"
      class="mx-3"
    />
    <Edit
      :item="data.editValue"
      :class="[data.activeEdit ? 'show-modal' : 'd-none']"
      @cancel="data.activeEdit = false"
      @edit="edit(data.editValue)"
    />
    <View :id="data.viewValue" />
  </div>
</template>

<script>
import Table from "../../components/table/tbl_medical.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import AddMedi from "./add_medical.vue";
import AddApp from "./add_app.vue";
import View from "./view.vue";
import { reactive, computed, onBeforeMount, ref } from "vue";
import {
  http_create,
  http_update,
  http_getOne,
  http_deleteOne,
  http_getAll,
  http_getAllByMedicalHistoryId,
  http_getAllMedicalByUserId,
} from "../../assets/js/common.http";
import Appointment from "../../services/appointment.service";
import Medicine from "../../services/medicine.service";
import {
  alert_delete,
  alert_success,
  alert_error,
} from "../../assets/js/common.alert";
import Medical from "../../services/medical.service";
import Medicinee from "../../services/medicine.service";
import { formatCreatedAt } from "../../assets/js/common.format";
export default {
  components: {
    Table,
    Search,
    Select,
    Pagination,
    Add,
    Edit,
    AddMedi,
    AddApp,
    View,
  },
  setup() {
    const data = reactive({
      items: [],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 1,
      itemAdd: [],
      itemAddmedi: [],
      itemAddapp: [],
      activeEdit: false,
      editValue: {
        _id: "",
        diagnosis: "",
        medical_condition: "",
        doctor: "",
        note: "",
      },
      viewValue: {
        _id: "",
        diagnosis: "",
        start_date: "",
        medical_condition: "",
        doctor: "",
        note: "",
        Medicine: {
          name: "",
          frequency: "",
          doses: "",
          note: "",
        },
      },
    });

    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.diagnosis].join("").toLocaleLowerCase();
      });
    });
    const filter = computed(() => {
      return data.items.filter((value, index) => {
        return toString.value[index].includes(
          data.searchText.toLocaleLowerCase()
        );
      });
    });
    const filtered = computed(() => {
      if (!data.searchText) {
        data.totalRow = data.items.length;
        return data.items;
      } else {
        data.totalRow = filter.value.length;
        return filter.value;
      }
    });
    const setNumberOfPages = computed(() => {
      return Math.ceil(filtered.value.length / data.entryValue);
    });
    const setPages = computed(() => {
      if (data.items.length > 0) {
        if (setNumberOfPages.value == 0 || data.entryValue == "All") {
          data.entryValue = data.items.length;
          data.numberOfPages = 1;
        } else data.numberOfPages = setNumberOfPages.value;
        data.startRow = (data.currentPage - 1) * data.entryValue + 1;
        data.endRow = data.currentPage * data.entryValue;

        return filtered.value
          .map((item) => {
            return {
              ...item,
              start_date: item.Appointment ? item.Appointment.start_date : "-",
            };
          })
          .sort((a, b) => {
        const dateA = new Date(b.start_date);
        const dateB = new Date(a.start_date);
        return dateA - dateB;
      })
          .filter((item, index) => {
            return (
              index + 1 > (data.currentPage - 1) * data.entryValue &&
              index + 1 <= data.currentPage * data.entryValue
            );
          });
      } else return data.items.value;
    });
    let myVariable;
    // Methods
    const getId = async (_id) => {
      // console.log("_id:", _id); // Log the _id variable
      myVariable = ref(_id); // Create a reactive variable and store the value of _id in it
      // console.log("myVariable:", myVariable); // Log the value of myVariable (use .value to access its value)
    };
    const create1 = async () => {
      const id = sessionStorage.getItem("UserId");
      const AppData = {
        appointment_type: "Khám Bệnh",
        start_date: "-",
        place: "-",
        status: "-",
        note: "",
        UserId: id,
      };
      const createApp = await http_create(Appointment, AppData);
      const createAppId = createApp.document._id;
      const created = createApp.document.createdAt;
      const formattedCreatedAt = formatCreatedAt(created);
      const putAppData = {
        appointment_type: "Khám Bệnh",
        start_date: formattedCreatedAt,
        place: "N/A",
        status: "Đã Hoàn Thành",
        note: "",
        UserId: id,
      };
      const updateApp = await http_update(Appointment, createAppId, putAppData);
      const MediData = {
        diagnosis: data.itemAddmedi.diagnosis,
        medical_condition: data.itemAddmedi.medical_condition,
        doctor: data.itemAddmedi.doctor,
        note: data.itemAddmedi.note,
        AppointmentId: createAppId,
      };
      const createMedi = await http_create(Medical, MediData);
      if (!createMedi.error) {
        // Sử dụng alert_success để thông báo thành công
        alert_success("Thêm thành công lịch sử khám bệnh", createMedi.msg);
        refresh();
      } else {
        // Sử dụng alert_error để thông báo lỗi
        alert_error("Lỗi khi thêm lịch sử khám bệnh", createMedi.msg);
        console.error("Lỗi khi thêm lịch sử khám bệnh:", createMedi.msg);
      }
    };
    const create = async (medicationsData) => {
      console.log(medicationsData);
      try {
        const medicalHistoryId = myVariable._value;
        // console.log("id", medicalHistoryId);
        for (const medication of medicationsData) {
          const medidata = {
            name: medication.name,
            frequency: medication.frequency,
            doses: medication.doses,
            note: medication.note,
            MedicalHistoryId: medicalHistoryId,
          };
          // console.log("medidata", medidata);
          const result = await http_create(Medicine, medidata);
          // console.log(result);
          if (!result.error) {
            // Sử dụng alert_success để thông báo thành công
            alert_success("Thêm thành công đơn thuốc", result.msg);
          } else {
            // Sử dụng alert_error để thông báo lỗi
            alert_error("Lỗi khi thêm đơn thuốc", result.msg);
            console.error("Lỗi khi thêm mục:", result.msg);
          }
        }
      } catch (error) {
        // Sử dụng alert_error để thông báo lỗi
        alert_error("Lỗi khi thêm đơn thuốc", error.message);
        console.error("Lỗi khi thêm mục:", error);
      }
    };
    const create2 = async () => {
      const id = sessionStorage.getItem("UserId");
      const dataapp = {
        appointment_type: data.itemAddapp.appointment_type,
        start_date: data.itemAddapp.start_date,
        place: data.itemAddapp.place,
        status: data.itemAddapp.status,
        note: data.itemAddapp.note,
        UserId: id,
      };
      const result = await http_create(Appointment, dataapp);
      if (!result.error) {
        alert_success("Thêm thành công", result.msg);
        if (result.document.appointment_type === "Tiêm Ngừa Covid 19") {
          const VaccData = {
            vaccination: "Tiêm Ngừa Covid",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "3255b608-f9e8-4aaf-8ec0-d911da5f18d0",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
          await refresh();
        } else if (result.document.appointment_type === "Tiêm Ngừa Uốn Ván") {
          const VaccData = {
            vaccination: "Tiêm Ngừa Uốn Ván",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "f0806c74-4e46-4de9-b631-d89edf676517",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
          await refresh();
        } else if (result.document.appointment_type === "Tiêm Ngừa Viêm Gan") {
          const VaccData = {
            vaccination: "N/A",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "4ec041ff-53e5-409b-a148-d41261361853",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
          await refresh();
        } else if (
          result.document.appointment_type === "Tiêm Ngừa Nhiễm Khuẩn"
        ) {
          const VaccData = {
            vaccination: "N/A",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "b010e9f9-bb13-4a99-9413-8b2b3d4a1cc9",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
          await refresh();
        } else if (
          result.document.appointment_type === "Tiêm Ngừa Bệnh Truyền Nhiễm"
        ) {
          const VaccData = {
            vaccination: "N/A",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "5c93ebcc-1ed6-48b6-a8de-ec458d72384e",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
          await refresh();
        } else if (result.document.appointment_type === "Khám Bệnh") {
          const MedicalData = {
            diagnosis: "N/A",
            medical_condition: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
          };
          const CreateMedical = await http_create(Medical, MedicalData);
          // console.log("Medical:", CreateMedical);
          await refresh();
        }
      } else {
        // Sử dụng alert_error để thông báo lỗi
        alert_error("Lỗi khi thêm", result.msg);
        console.error("Lỗi khi thêm:", result.msg);
      }
    };

    const edit = async (editValue) => {
      const result = await http_update(
        Medical,
        data.editValue._id,
        data.editValue
      );
      if (!result.error) {
        alert_success(`Sửa Lịch Sử Khám Bệnh`, `${result.msg}`);
        refresh();
      } else {
        alert_error(`Sửa Lịch Sử Khám Bệnh`, `${result.msg}`);
      }
    };

    const update = (item) => {
      console.log("updating", item);
    };
    const deleteOne = async (_id) => {
      const medical = await http_getOne(Medical, _id);
      const isConfirmed = await alert_delete(
        `Xoá Lịch Sử Khám Bệnh`,
        `Bạn đã có chắc chắn muốn xóa lịch sử khám bệnh`
      );
      if (isConfirmed == true) {
        const result = await http_deleteOne(Medical, _id);
        alert_success(`Xoá Lịch Sử Khám Bệnh`, result.msg);
        refresh();
      }
    };
    const deleteMany = async () => {
      const isConfirmed = await alert_delete(
        `Xoá Tất Cả Lịch Hẹn`,
        `Bạn đã có chắc chắn muốn xóa tất cả tiền sử bệnh tật`
      );

      if (isConfirmed == true) {
        const id = sessionStorage.getItem("UserId");
        const medicalData = await http_getAllMedicalByUserId(Medical, id);
        for (const medi of medicalData) {
          await http_deleteOne(Medical, medi._id);
        }
        refresh();
      }
    };

    const view = async (id) => {
      const dataMedi = await http_getAllByMedicalHistoryId(Medicinee, id._id);
      // Khởi tạo một mảng để lưu thông tin tất cả các thuốc
      const medicines = [];

      // Duyệt qua tất cả các đối tượng thuốc trong dataMedi
      if (dataMedi && dataMedi.length > 0) {
        dataMedi.forEach((medicine) => {
          medicines.push({
            name: medicine.name,
            frequency: medicine.frequency,
            doses: medicine.doses,
            note: medicine.note,
          });
        });
      }
      // Gán danh sách thuốc vào Medicine
      data.viewValue = {
        _id: id._id,
        diagnosis: id.diagnosis,
        start_date: id.start_date,
        medical_condition: id.medical_condition,
        doctor: id.doctor,
        note: id.note,
        Medicine: medicines,
      };
      console.log(data.viewValue);
    };

    const refresh = async () => {
      const id = sessionStorage.getItem("UserId");
      const medicalData = await http_getAllMedicalByUserId(Medical, id);

      // Filter out items with null Appointment
      data.items = medicalData.filter((item) => item.Appointment !== null);

      console.log("data nè", data.items);
    };

    onBeforeMount(async () => {
      refresh();
    });
    return {
      data,
      setPages,
      edit,
      update,
      create,
      deleteOne,
      getId,
      create1,
      create2,
      view,
      deleteMany
    };
  },
};
</script>

<style scoped>
.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.menu {
  /* border: 1px solid var(--gray); */
  border-collapse: collapse;
}
.menu a {
  border: 1px solid var(--gray);
  border-collapse: collapse;
  padding: 8px 12px;
  font-size: 15px;
}
.active-menu {
  color: blue;
}
.none-active-menu {
  color: var(--dark);
}
.border-hr {
  border-top: 1px solid var(--gray);
}
#add,
#delete-all {
  font-size: 14px;
}
.input {
  background-color: inherit;
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.show-modal {
  display: block;
  opacity: 1; /* You can adjust the opacity as needed */
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  position: fixed; /* To cover the entire screen */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999, 1; /* Ensure the modal is on top of other content */
}
</style>
