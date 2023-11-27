<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'HealthRecords' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Tổng Quan</span>
      </router-link>
      <router-link
        :to="{ name: 'Allergys' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Dị Ứng</span>
      </router-link>
      <router-link
        :to="{ name: 'Chronics' }"
        @click="activeMenu = 3"
        :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Bệnh Mãn Tính</span>
      </router-link>
      <!-- <router-link
          :to="{ name: '' }"
          @click="activeMenu = 2"
          :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Bệnh Tật</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 3"
          :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Tiêm Chủng</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 4"
          :class="[activeMenu == 4 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Dị Ứng</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 5"
          :class="[activeMenu == 5 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Bệnh Mãn Tính</span>
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
        <Select
          class="d-flex justify-content-start"
          :title="`Lọc theo Bệnh Mãn Tính`"
          :entryValue="selectedAllergyType"
          :options="data.name"
          @update:entryValue="(value) => (selectedAllergyType = value)"
          @refresh="
            (selectedAllergyType = 'Bệnh Mãn Tính'), (data.currentPage = 1)
          "
          style="width: 150px; margin-left: 15px"
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
          data-target="#modal-addchrno"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
      </div>
      <Add :item="data.itemAdd" @create="create" />
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Người Dùng',
        'Tên Bệnh Mãn Tính',
        'Ngày Chuẩn Đoán',
        'Bác Sĩ Chuẩn Đoán',
        'Tình Trạng Hiện Tại',
        'Mô Tả',
      ]"
      :labels="[
        'username',
        'name',
        'diagnosis_date',
        'doctor',
        'current_status',
        'description',
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
import Table from "../../components/table/tbl_health.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import Add from "./add_chronic.vue";
import Edit from "./edit_chronic.vue";
import { ref, reactive, computed, onBeforeMount, watch } from "vue";
import {
  http_create,
  http_getAll,
  http_deleteOne,
  http_getOne,
  http_update,
} from "../../assets/js/common.http";
import { formatDate } from "../../assets/js/common.format";
import Chronic from "../../services/chronic.service";
import {
  alert_success,
  alert_error,
  alert_delete,
} from "../../assets/js/common.alert";
export default {
  components: {
    Table,
    Search,
    Select,
    Add,
    Pagination,
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
        recording_date: "",
        weight: "",
        height: "",
        blood_pressure: "",
        blood_type: "",
        heart_rate: "",
      },
      name: {},
    });
    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.description].join("").toLocaleLowerCase();
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
              username: item.User ? item.User.name : "-",
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
    const create = async () => {
      const idne = sessionStorage.getItem("UserId");
      const ChronicData = {
        UserId: idne,
        name: data.itemAdd.name,
        diagnosis_date: data.itemAdd.diagnosis_date,
        doctor: data.itemAdd.doctor,
        current_status: data.itemAdd.current_status,
        description: data.itemAdd.description,
      };
      const result = await http_create(Chronic, ChronicData);
      if (!result.error) {
        // console.log("health_statistic:", result);
        alert_success("Tạo Hồ Sơ Bệnh Mãn Tính", result.msg);
        await refresh();
      } else {
        console.log("Lỗi", result.msg);
        alert_error("Tạo Hồ Sơ Bệnh Mãn Tính", result.msg);
      }
    };
    const deleteOne = async (_id) => {
      const health = await http_getOne(Chronic, _id);
      // console.log("deleting", user);
      const isConfirmed = await alert_delete(
        `Xoá Hồ Sơ Bệnh Mãn Tính`,
        `Bạn có chắc chắn muốn xoá hồ sơ ngày ${health.diagnosis_date} ?`
      );
      // console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Chronic, _id);
        // console.log("Name:", result);
        alert_success(`Xoá Hồ Sơ`, `Bạn đã xoá thành công hồ sơ.`);
        refresh();
      }
    };
    const edit = async () => {
      const result = await http_update(
        Chronic,
        data.editValue._id,
        data.editValue
      );
      if (!result.error) {
        alert_success(`Sửa Hồ Sơ`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa Hồ Sơ`, `${result.msg}`);
      }
    };
    const deleteAll = async () => {
      const isConfirmed = await alert_delete(
        "Xoá Tất Cả Hồ Sơ",
        "Bạn có chắc chắn muốn xoá tất cả hồ sơ?"
      );
      if (isConfirmed) {
        // Lặp qua data.items và xóa tất cả
        if (data.items.length == 0) {
          alert_error("Xoá Tất Cả Hồ Sơ", "Không có hồ sơ nào để xóa!");
        }
        for (const item of data.items) {
          const result = await http_deleteOne(Chronic, item._id);
          if (!result.error) {
            alert_delete(`Đã xoá hồ sơ`, result.msg);
          } else {
            alert_error(`Lỗi`, result.msg);
          }
        }
        await refresh();
      }
    };
    // lọc
    const selectedAllergyType = ref("Bệnh Mãn Tính");
    const entryValueAllergyType = ref("");
    const refresh = async () => {
      data.items = await http_getAll(Chronic);
      // const id = sessionStorage.getItem("UserId");
      // data.items = data.items.filter((user) => user.UserId === id);
      const allergyTypes = await http_getAll(Chronic);
      // Filter the allergyTypes based on UserId
      // const filteredAllergyTypes = allergyTypes.filter(
      //   (type) => type.UserId === id
      // );
      // Create a Set to store unique name values
      const uniqueAllergyTypes = new Set();

      // Iterate through the allergyTypes and add unique values to the Set
      allergyTypes.forEach((value) => {
        uniqueAllergyTypes.add(value.name);
      });

      // Map the unique values to the format you need for the Select component
      data.name = [...uniqueAllergyTypes].map((value, index) => {
        return {
          name: value,
          value: value,
        };
      });

      selectedAllergyType.value = "Bệnh Mãn Tính";
      entryValueAllergyType.value = "";
    };
    watch(selectedAllergyType, async (newAllergyType) => {
      if (newAllergyType === "Bệnh Mãn Tính") {
        // If 'Loại Dị Ứng' is selected, reset the filter and refresh the data.
        data.currentPage = 1;
        await refresh();
      } else {
        // Filter the data based on the selected allergy type.
        data.currentPage = 1;
        data.items = await http_getAll(Chronic);
        // const id = sessionStorage.getItem("UserId");
        // data.items = data.items.filter((user) => user.UserId === id);
        if (newAllergyType !== "Bệnh Mãn Tính") {
          data.items = data.items.filter((record) => {
            return record.name === newAllergyType;
          });
        }
      }
    });
    onBeforeMount(async () => {
      refresh();
      // console.log(data.items);
    });
    const activeMenu = ref(3);
    return {
      data,
      setPages,
      create,
      deleteOne,
      edit,
      deleteAll,
      activeMenu,
      selectedAllergyType,
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
  z-index: 99; /* Ensure the modal is on top of other content */
}
</style>
