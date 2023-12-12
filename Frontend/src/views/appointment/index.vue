<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: '' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Lịch Hẹn</span>
      </router-link>
      <!-- <router-link
        :to="{ name: 'FamilyTypes' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Quản Lý Gia Đình</span>
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
          class="btn btn-outline-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
          @click="deleteAll()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#modal-addapp"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add :item="data.itemAdd" @create="create" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Loại Cuộc Hẹn',
        'Ngày Bắt Đầu',
        'Địa Điểm',
        'Trạng Thái',
        'Ghi Chú',
      ]"
      :labels="['appointment_type', 'start_date', 'place', 'status', 'note']"
      @delete="(value) => deleteOne(value)"
      @edit="
        (value, value1) => (
          (data.editValue = value), (data.activeEdit = value1)
        )
      "
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
  </div>
</template>

<script>
import Table from "../../components/table/tbl_health.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import { reactive, computed, onBeforeMount } from "vue";
import {
  http_create,
  http_update,
  http_getOne,
  http_deleteOne,
  http_getAll,
} from "../../assets/js/common.http";
import Appointment from "../../services/appointment.service";
import {
  alert_delete,
  alert_success,
  alert_error,
} from "../../assets/js/common.alert";
import Vaccination from "../../services/vaccination.service";
import Medical from "../../services/medical.service";
import { formatDate } from "../../assets/js/common.format";
export default {
  components: {
    Table,
    Search,
    Select,
    Pagination,
    Add,
    Edit,
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
      itemAdd: {},
      activeEdit: false,
      editValue: {
        _id: "",
        appointment_type: "",
        start_date: "",
        place: "",
        status: "",
        note: "",
      },
    });
    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.appointment_type, value.start_date, value.place, value.note].join("").toLocaleLowerCase();
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
        return filtered.value.filter((item, index) => {
          return (
            index + 1 > (data.currentPage - 1) * data.entryValue &&
            index + 1 <= data.currentPage * data.entryValue
          );
          
        });
        
      } else return data.items.value;
    });

    // Methods
    const create = async () => {
      const UserId = sessionStorage.getItem("UserId");
      const AppData = {
        UserId: UserId,
        appointment_type: data.itemAdd.appointment_type,
        start_date: data.itemAdd.start_date,
        place: data.itemAdd.place,
        status: data.itemAdd.status,
        note: data.itemAdd.note,
      };
      // console.log(create);
      const result = await http_create(Appointment, AppData);
      if (!result.error) {
        alert_success(
          `Tạo Cuộc Hẹn`,
          `Bạn Đã Tạo Thành Công Cuộc Hẹn ${result.document.appointment_type} Ngày ${result.document.start_date}`
        );
        if (result.document.appointment_type === "Tiêm Ngừa Covid 19") {
          const VaccData = {
            vaccination: "Covid 19",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "4f663f89-50e2-46c1-8560-4f177f59f519",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
        } else if (result.document.appointment_type === "Tiêm Ngừa Uốn Ván") {
          const VaccData = {
            vaccination: "Uốn Ván",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "f9704062-0364-4555-bd67-3ee563aa231b",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
        } else if (result.document.appointment_type === "Tiêm Ngừa Viêm Gan") {
          const VaccData = {
            vaccination: "N/A",
            vaccine: "N/A",
            doses: "N/A",
            doctor: "N/A",
            note: "",
            AppointmentId: result.document._id,
            VaccineTypeId: "5f38067e-9cd0-4a2d-93e9-8fadcc0dc702",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
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
            VaccineTypeId: "6d5b4721-0d7d-481a-968b-2a74e7269ab0",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
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
            VaccineTypeId: "db1a3d90-d1b0-4deb-9b2b-40a0d1b3b7ae",
          };
          const CreateVaccination = await http_create(Vaccination, VaccData);
          // console.log("Data Vacc:", CreateVaccination);
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
        }
      } else {
        alert_error(`Tạo Cuộc Hẹn`, result.msg);
      }
      await refresh();
    };
    const edit = async (editValue) => {
      console.log(editValue);
      const result = await http_update(Appointment, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa Lịch Hẹn`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa Lịch Hẹn`, `${result.msg}`);
      }
    };

    const update = (item) => {
      console.log("updating", item);
    };
    const deleteOne = async (_id) => {
      const appointment = await http_getOne(Appointment, _id);
      const isConfirmed = await alert_delete(
        `Xoá Lịch Hẹn`,
        `Bạn có chắc chắn muốn xoá lịch hẹn ${appointment.appointment_type} ngày ${appointment.start_date} không ?`
      );
      if (isConfirmed == true) {
        const result = await http_deleteOne(Appointment, _id);
        alert_success(
          `Xoá Lịch Hẹn`,
          `Bạn đã xoá thành công lịch hẹn ${result.document.appointment_type} ngày ${result.document.start_date}`
        );
        refresh();
      }
    };
    const deleteAll = async () => {
  const isConfirmed = await alert_delete(
    `Xoá Tất Cả Lịch Hẹn`,
    `Bạn đã có chắc chắn muốn xóa tất cả lịch hẹn`
  );

  if (isConfirmed == true) {
    const id = sessionStorage.getItem("UserId");
      data.items = await http_getAll(Appointment);
      
      // Lọc ra các mục có UserId giống với id đã đăng nhập
      data.items = data.items.filter(
        (appointment) => appointment.UserId === id
      );

    // Tiến hành xóa tất cả các Vaccination thuộc về người dùng
    for (const app of data.items) {
      await http_deleteOne(Appointment, app._id);
    }

    // Sau khi xóa xong tất cả các lịch hẹn, bạn có thể thực hiện một số thứ khác, ví dụ: làm mới danh sách
    refresh();
  }
};

    const refresh = async () => {
      const id = sessionStorage.getItem("UserId");
      data.items = await http_getAll(Appointment);
      
      // Lọc ra các mục có UserId giống với id đã đăng nhập
      data.items = data.items.filter(
        (appointment) => appointment.UserId === id
      );
      
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
      deleteOne,deleteAll
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
