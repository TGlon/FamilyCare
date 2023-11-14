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
    </div>
    <!-- Filter -->
    <!-- <span class="mx-3 mb-3 h6">Lọc Loại Dị Ứng</span> -->
    <!-- <div class="d-flex mx-3">
      <div class="form-group w-100 mr-2">
        <Select
          :title="`Lọc theo Loại Dị Ứng`"
          :entryValue="selectedAllergyType"
          :options="data.allergy_type"
          @update:entryValue="(value) => (selectedAllergyType = value)"
          @refresh="
            (selectedAllergyType = 'Loại Dị Ứng'), (data.currentPage = 1)
          "
          style="height: 35px; width: 150px"
        />
      </div>
    </div> -->
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
          :title="`Lọc theo Loại Dị Ứng`"
          :entryValue="selectedAllergyType"
          :options="data.allergy_type"
          @update:entryValue="(value) => (selectedAllergyType = value)"
          @refresh="
            (selectedAllergyType = 'Loại Dị Ứng'), (data.currentPage = 1)
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
          data-target="#modal-addalle"
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
        'Loại Dị Ứng',
        'Ngày Phát Hiện',
        'Mức Độ',
        'Bác Sĩ Chuẩn Đoán',
        'Mô Tả',
      ]"
      :labels="[
        'allergy_type',
        'detection_date',
        'severity',
        'doctor',
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
import Add from "./add_allergy.vue";
import Edit from "./edit_allergy.vue";
import { ref, reactive, computed, onBeforeMount, watch } from "vue";
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
import Allergy from "../../services/allergy.services";
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
        allergy_type: "",
        detection_date: "",
        severity: "",
        doctor: "",
        description: "",
      },
      allergy_type: {},
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
      const id = sessionStorage.getItem("UserId");
      const dataAlle = {
        allergy_type: data.itemAdd.allergy_type,
        detection_date: data.itemAdd.detection_date,
        has_allergy: "True",
        severity: data.itemAdd.severity,
        doctor: data.itemAdd.doctor,
        description: data.itemAdd.description,
        UserId: id,
      };
      const result = await http_create(Allergy, dataAlle);
      if (!result.error) {
        alert_success("Tạo Thành Công Hồ Sơ Bệnh Dị Ứng", result.msg);
        refresh();
      } else {
        alert_error("Lỗi", result.msg);
      }
    };
    const deleteOne = async (_id) => {
      const allergy = await http_getOne(Allergy, _id);
      // console.log("deleting", user);
      const isConfirmed = await alert_delete(
        `Xoá Hồ Sơ Dị Ứng`,
        `Bạn có chắc chắn muốn xoá hồ sơ dị ứng ${allergy.allergy_type} ngày ${allergy.detection_date} ?`
      );
      // console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Allergy, _id);
        // console.log("Name:", result);
        alert_success(
          `Xoá Hồ Sơ Sức Khỏe`,
          `Bạn đã xoá thành công hồ sơ dị ứng ${result.document.allergy_type}.`
        );
        refresh();
      }
    };
    const edit = async () => {
      const result = await http_update(
        Allergy,
        data.editValue._id,
        data.editValue
      );
      if (!result.error) {
        alert_success(`Sửa Hồ Sơ Dị Ứng`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa Hồ Sơ Dị Ứng`, `${result.msg}`);
      }
    };
    const deleteAll = async () => {
      const isConfirmed = await alert_delete(
        "Xoá Tất Cả Hồ Sơ Dị Ứng",
        "Bạn có chắc chắn muốn xoá tất cả hồ sơ dị ứng?"
      );
      if (isConfirmed) {
        // Lặp qua data.items và xóa tất cả
        if (data.items.length == 0) {
          alert_error("Xoá Tất Cả Hồ Sơ Dị Ứng", "Không có hồ sơ nào để xóa!");
        }
        for (const item of data.items) {
          const result = await http_deleteOne(Allergy, item._id);
          if (!result.error) {
            console.log(`Đã xoá hồ sơ thành công`);
          } else {
            console.error(`Lỗi khi xoá hồ sơ: ${result.msg}`);
          }
        }
        await refresh();
      }
    };

    // lọc
    const selectedAllergyType = ref("Loại Dị Ứng");
    const entryValueAllergyType = ref("");
    const refresh = async () => {
      data.items = await http_getAll(Allergy);
      const id = sessionStorage.getItem("UserId");
      data.items = data.items.filter((user) => user.UserId === id);
      const allergyTypes = await http_getAll(Allergy);
      // const filteredAllergyTypes = allergyTypes.filter((type) => type.UserId === id);
      // Create a Set to store unique allergy_type values
      const uniqueAllergyTypes = new Set();

      // Iterate through the allergyTypes and add unique values to the Set
      allergyTypes.forEach((value) => {
        uniqueAllergyTypes.add(value.allergy_type);
      });

      // Map the unique values to the format you need for the Select component
      data.allergy_type = [...uniqueAllergyTypes].map((value, index) => {
        return {
          name: value,
          value: value,
        };
      });

      selectedAllergyType.value = "Loại Dị Ứng";
      entryValueAllergyType.value = "";
    };

    watch(selectedAllergyType, async (newAllergyType) => {
      if (newAllergyType === "Loại Dị Ứng") {
        // If 'Loại Dị Ứng' is selected, reset the filter and refresh the data.
        data.currentPage = 1;
        await refresh();
      } else {
        // Filter the data based on the selected allergy type.
        data.currentPage = 1;
        data.items = await http_getAll(Allergy);
        const id = sessionStorage.getItem("UserId");
        data.items = data.items.filter((user) => user.UserId === id);
        if (newAllergyType !== "Loại Dị Ứng") {
          data.items = data.items.filter((record) => {
            return record.allergy_type === newAllergyType;
          });
        }
      }
    });

    onBeforeMount(async () => {
      refresh();
      // console.log(data.items);
    });
    const activeMenu = ref(2);
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
