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
          data-target="#modal-addhealth"
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
        'Ngày Ghi Nhận',
        'Cân Nặng',
        'Chiều Cao',
        'Huyết Áp',
        'Nhịp Tim',
        'Nhóm Máu',
      ]"
      :labels="[
        'recording_date',
        'weight',
        'height',
        'blood_pressure',
        'heart_rate',
        'blood_type',
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
import Add from "./add.vue";
import Edit from "./edit.vue";
import {ref, reactive, computed, onBeforeMount } from "vue";
import {
  http_create,
  http_getAll,
  http_deleteOne,
  http_getOne,
  http_update,
} from "../../assets/js/common.http";
import { formatDate } from "../../assets/js/common.format";
import Health_Statistic from "../../services/health_statistics.service";
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
    });
    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.recording_date].join("").toLocaleLowerCase();
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
      const idne = sessionStorage.getItem("UserId");
      const Health_Statistic_Data = {
        UserId: idne,
        recording_date: data.itemAdd.recording_date,
        weight: data.itemAdd.weight,
        height: data.itemAdd.height,
        blood_pressure: data.itemAdd.blood_pressure,
        blood_type: data.itemAdd.blood_type,
        heart_rate: data.itemAdd.heart_rate,
      };
      const result = await http_create(Health_Statistic, Health_Statistic_Data);
      if (!result.error) {
        // console.log("health_statistic:", result);
        alert_success("Tạo Hồ Sơ Sức Khỏe", result.msg);
        await refresh();
      } else {
        console.log("Lỗi", result.msg);
        alert_error("Tạo Hồ Sơ Sức Khỏe", result.msg);
      }
    };
    const deleteOne = async (_id) => {
      const health = await http_getOne(Health_Statistic, _id);
      // console.log("deleting", user);
      const isConfirmed = await alert_delete(
        `Xoá Hồ Sơ Sức Khỏe`,
        `Bạn có chắc chắn muốn xoá hồ sơ ngày ${health.recording_date} ?`
      );
      // console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Health_Statistic, _id);
        // console.log("Name:", result);
        alert_success(
          `Xoá Hồ Sơ Sức Khỏe`,
          `Bạn đã xoá thành công hồ sơ ngày ${result.document.recording_date}.`
        );
        refresh();
      }
    };
    const edit = async () => {
      const result = await http_update(
        Health_Statistic,
        data.editValue._id,
        data.editValue
      );
      if (!result.error) {
        alert_success(`Sửa Hồ Sơ Sức Khỏe`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa Hồ Sơ Sức Khỏe`, `${result.msg}`);
      }
    };
    const deleteAll = async () => {
      const isConfirmed = await alert_delete(
        "Xoá Tất Cả Hồ Sơ Sức Khỏe",
        "Bạn có chắc chắn muốn xoá tất cả hồ sơ sức khỏe?"
      );
      if (isConfirmed) {
        // Lặp qua data.items và xóa tất cả
        if(data.items.length == 0){
          alert_error("Xoá Tất Cả Hồ Sơ Sức Khỏe", "Không có hồ sơ nào để xóa!")
        }
        for (const item of data.items) {
          const result = await http_deleteOne(Health_Statistic, item._id);
          if (!result.error) {
            console.log(`Đã xoá hồ sơ ngày ${item.recording_date}`);
          } else {
            console.error(
              `Lỗi khi xoá hồ sơ ngày ${item.recording_date}: ${result.msg}`
            );
          }
        }
        await refresh();
      }
    };
    const refresh = async () => {
      const id = sessionStorage.getItem("UserId");
      data.items = await http_getAll(Health_Statistic);
      // console.log(data.items);
      data.items = data.items.filter(
        (user) => user.UserId === id
      );
    };
    onBeforeMount(async () => {
      refresh();
      // console.log(data.items);
    });
    const activeMenu = ref(1);
    return {
      data,
      setPages,
      create,
      deleteOne,
      edit,
      deleteAll,
      activeMenu
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
