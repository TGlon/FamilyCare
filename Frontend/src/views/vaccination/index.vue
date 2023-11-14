<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: '' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Lịch Sử Tiêm Ngừa</span>
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
          class="btn btn-outline-danger"
          data-toggle="modal"
          data-target="#model-delete-all"
          @click="deleteAll()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-outline-primary ml-2"
          data-toggle="modal"
          data-target="#modal-addvacc"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <!-- <Add
          :item="data.itemAdd"
          :mqh="data.relationship"
          :fam="data.familyadd"
          @create="create"
        /> -->
        <Add :item="data.itemAdd" @create="create" />
        <AddApp :item="data.itemAddapp" @create2="create2" />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Tiêm Ngừa',
        'Loại Tiêm Ngừa',
        'Vaccine',
        'Ngày Tiêm',
        'Liều Lượng',
        'Bác Sĩ',
        'Ghi Chú',
      ]"
      :labels="[
        'vaccination',
        'name',
        'vaccine',
        'start_date',
        'doses',
        'doctor',
        'note',
      ]"
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
import Table from "../../components/table/tbl_vacc.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import { reactive, computed, onBeforeMount } from "vue";
import Vaccination from "../../services/vaccination.service";
import Appointment from "../../services/appointment.service";
import {
  http_create,
  http_update,
  http_getOne,
  http_deleteOne,
  http_getAll,
} from "../../assets/js/common.http";
import {
  alert_delete,
  alert_success,
  alert_error,
} from "../../assets/js/common.alert";
import Edit from "./edit.vue";
import Add from "./add.vue";
import AddApp from "./add_app.vue";
import { formatCreatedAt } from "../../assets/js/common.format";
import Medical from "../../services/medical.service";
export default {
  components: {
    Table,
    Search,
    Select,
    Pagination,
    Edit,
    Add,
    AddApp,
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
      activeEdit: false,
      itemAdd: {},
      editValue: {
        _id: "",
        vaccine: "",
        doses: "",
        doctor: "",
        note: "",
      },
      itemAddapp: {},
    });
    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.vaccination].join("").toLocaleLowerCase();
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
              name: item.Vaccine_Type ? item.Vaccine_Type.name : "",
            };
          })
          .filter((item, index) => {
            return (
              index + 1 > (data.currentPage - 1) * data.entryValue &&
              index + 1 <= data.currentPage * data.entryValue
            );
          });
      } else return data.items.value;
    });

    // Methods
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
        alert_success(
          `Tạo Cuộc Hẹn`,
          `Bạn Đã Tạo Thành Công Cuộc Hẹn ${result.document.appointment_type} Ngày ${result.document.start_date}`
        );
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
    const create = async () => {
      const id = sessionStorage.getItem("UserId");
      const AppData = {
        appointment_type: "-",
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
      if (data.itemAdd.name === "Covid 19") {
        const putAppData = {
          appointment_type: "Tiêm Ngừa Covid 19",
          start_date: formattedCreatedAt,
          place: "N/A",
          status: "Đã Hoàn Thành",
          note: "",
          UserId: id,
        };
        const updateApp = await http_update(
          Appointment,
          createAppId,
          putAppData
        );
        const vaccData = {
          vaccination: data.itemAdd.vaccination,
          vaccine: data.itemAdd.vaccine,
          doses: data.itemAdd.doses,
          doctor: data.itemAdd.doctor,
          note: data.itemAdd.note,
          AppointmentId: createAppId,
          VaccineTypeId: "3255b608-f9e8-4aaf-8ec0-d911da5f18d0",
        };
        const createVacc = await http_create(Vaccination, vaccData);
        if (!createVacc.error) {
          alert_success(`Thêm Lịch Sử Tiêm Ngừa`, createVacc.msg);
          await refresh();
        } else {
          alert_error(`Lỗi`, createVacc.msg);
        }
      } else if (data.itemAdd.name === "Viêm Gan") {
        const putAppData = {
          appointment_type: "Tiêm Ngừa Viêm Gan",
          start_date: formattedCreatedAt,
          place: "N/A",
          status: "Đã Hoàn Thành",
          note: "",
          UserId: id,
        };
        const updateApp = await http_update(
          Appointment,
          createAppId,
          putAppData
        );
        const vaccData = {
          vaccination: data.itemAdd.vaccination,
          vaccine: data.itemAdd.vaccine,
          doses: data.itemAdd.doses,
          doctor: data.itemAdd.doctor,
          note: data.itemAdd.note,
          AppointmentId: createAppId,
          VaccineTypeId: "4ec041ff-53e5-409b-a148-d41261361853",
        };
        const createVacc = await http_create(Vaccination, vaccData);
        if (!createVacc.error) {
          alert_success(`Thêm Lịch Sử Tiêm Ngừa`, createVacc.msg);
          await refresh();
        } else {
          alert_error(`Lỗi`, createVacc.msg);
        }
      } else if (data.itemAdd.name === "Nhiễm Khuẩn") {
        const putAppData = {
          appointment_type: "Tiêm Ngừa Nhiễm Khuẩn",
          start_date: formattedCreatedAt,
          place: "N/A",
          status: "Đã Hoàn Thành",
          note: "",
          UserId: id,
        };
        const updateApp = await http_update(
          Appointment,
          createAppId,
          putAppData
        );
        const vaccData = {
          vaccination: data.itemAdd.vaccination,
          vaccine: data.itemAdd.vaccine,
          doses: data.itemAdd.doses,
          doctor: data.itemAdd.doctor,
          note: data.itemAdd.note,
          AppointmentId: createAppId,
          VaccineTypeId: "b010e9f9-bb13-4a99-9413-8b2b3d4a1cc9",
        };
        const createVacc = await http_create(Vaccination, vaccData);
        if (!createVacc.error) {
          alert_success(`Thêm Lịch Sử Tiêm Ngừa`, createVacc.msg);
          await refresh();
        } else {
          alert_error(`Lỗi`, createVacc.msg);
        }
      } else if (data.itemAdd.name === "Truyền Nhiễm") {
        const putAppData = {
          appointment_type: "Tiêm Ngừa Truyền Nhiễm",
          start_date: formattedCreatedAt,
          place: "N/A",
          status: "Đã Hoàn Thành",
          note: "",
          UserId: id,
        };
        const updateApp = await http_update(
          Appointment,
          createAppId,
          putAppData
        );
        const vaccData = {
          vaccination: data.itemAdd.vaccination,
          vaccine: data.itemAdd.vaccine,
          doses: data.itemAdd.doses,
          doctor: data.itemAdd.doctor,
          note: data.itemAdd.note,
          AppointmentId: createAppId,
          VaccineTypeId: "5c93ebcc-1ed6-48b6-a8de-ec458d72384e",
        };
        const createVacc = await http_create(Vaccination, vaccData);
        if (!createVacc.error) {
          alert_success(`Thêm Lịch Sử Tiêm Ngừa`, createVacc.msg);
          await refresh();
        } else {
          alert_error(`Lỗi`, createVacc.msg);
        }
      } else if (data.itemAdd.name === "Uốn Ván") {
        const putAppData = {
          appointment_type: "Tiêm Ngừa Uốn Ván",
          start_date: formattedCreatedAt,
          place: "N/A",
          status: "Đã Hoàn Thành",
          note: "",
          UserId: id,
        };
        const updateApp = await http_update(
          Appointment,
          createAppId,
          putAppData
        );
        const vaccData = {
          vaccination: data.itemAdd.vaccination,
          vaccine: data.itemAdd.vaccine,
          doses: data.itemAdd.doses,
          doctor: data.itemAdd.doctor,
          note: data.itemAdd.note,
          AppointmentId: createAppId,
          VaccineTypeId: "f0806c74-4e46-4de9-b631-d89edf676517",
        };
        const createVacc = await http_create(Vaccination, vaccData);
        if (!createVacc.error) {
          alert_success(`Thêm Lịch Sử Tiêm Ngừa`, createVacc.msg);
          await refresh();
        } else {
          alert_error(`Lỗi`, createVacc.msg);
        }
      }
      // if(data.itemAdd.vaccination.includes("Covid 19")){
      //   const vaccData = {
      //     vaccination: data.itemAdd.vaccination,
      //     vaccine: data.itemAdd.vaccine,
      //     doses: data.itemAdd.doses,
      //     doctor: data.itemAdd.doctor,
      //     note: data.itemAdd.note,
      //     AppointmentId: createAppId,
      //     VaccineTypeId: "3255b608-f9e8-4aaf-8ec0-d911da5f18d0",
      //   }
      //   const createVacc = await http_create(Vaccination, vaccData);
      //   if(!createVacc.error){
      //     alert_success(`Thêm Lịch Sử Tiêm Ngừa`, createVacc.msg);
      //     await refresh();
      //   }else{
      //     alert_error(`Lỗi`, createVacc.msg);
      //   }
      // }
    };

    const edit = async () => {
      const result = await http_update(
        Vaccination,
        data.editValue._id,
        data.editValue
      );
      if (!result.error) {
        alert_success(`Sửa Lịch Sử Tiêm Ngừa`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa Lịch Sử Tiêm Ngừa`, `${result.msg}`);
      }
    };
    const deleteOne = async (_id) => {
      const vaccination = await http_getOne(Vaccination, _id);
      const isConfirmed = await alert_delete(
        `Xoá Lịch Hẹn`,
        `Bạn đã có chắc chắn muốn xóa lịch sử tiêm ngừa`
      );
      if (isConfirmed == true) {
        const result = await http_deleteOne(Vaccination, _id);
        alert_success(`Xoá Lịch Hẹn`, result.msg);
        refresh();
      }
    };
    const deleteAll = async () => {
      const isConfirmed = await alert_delete(
        `Xoá Tất Cả Lịch Hẹn`,
        `Bạn đã có chắc chắn muốn xóa tất cả lịch sử tiêm ngừa`
      );

      if (isConfirmed == true) {
        const id = sessionStorage.getItem("UserId");
        const items = await http_getAll(Vaccination);

        // Lọc danh sách các Vaccination thuộc về người dùng có id tương ứng
        const userVaccinations = items.filter(
          (item) => item.Appointment.UserId === id
        );

        // Tiến hành xóa tất cả các Vaccination thuộc về người dùng
        for (const vaccination of userVaccinations) {
          await http_deleteOne(Vaccination, vaccination._id);
        }

        // Sau khi xóa xong tất cả các lịch hẹn, bạn có thể thực hiện một số thứ khác, ví dụ: làm mới danh sách
        refresh();
      }
    };

    const update = (item) => {
      console.log("updating", item);
    };
    const refresh = async () => {
      const id = sessionStorage.getItem("UserId");
      data.items = await http_getAll(Vaccination);
      data.items = data.items.filter((item) => item.Appointment.UserId === id);
      console.log(data.items);
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
      create2,
      deleteOne,
      deleteAll,
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
