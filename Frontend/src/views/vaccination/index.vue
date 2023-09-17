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
          @update:entryValue="(value) => (data.entryValue = value)"
          :entryValue="data.entryValue"
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
          @click="deleteMany()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button>
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#modal-addmember"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add
          :item="data.itemAdd"
          :mqh="data.relationship"
          :fam="data.familyadd"
          @create="create"
        />
      </div>
    </div>
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="[
        'Loại Tiêm Ngừa',
        'Vaccine',
        'Liều Lượng',
        'Bác Sĩ',
        'Ghi Chú',
      ]"
      :labels="[
        'vaccinetype',
        'vaccine',
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
    
  </div>
</template>

<script>
import Table from "../../components/table/tbl_famrls.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import { reactive, computed, onBeforeMount } from "vue";
import {
  http_create,
  http_update,
  http_getOne,
  http_deleteOne,
  http_getAllByUserId,
  http_getAllUserIdByFamilyId,
} from "../../assets/js/common.http";
import User from "../../services/user.service";
import User_Family from "../../services/user_family.service";
import {
  alert_delete,
  alert_success,
  alert_error,
} from "../../assets/js/common.alert";
export default {
  components: {
    Table,
    Search,
    Select,
    Pagination,
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
      
    });
    // computed
    const toString = computed(() => {
      console.log("Starting search");
      return data.items.map((value, index) => {
        return [value.name].join("").toLocaleLowerCase();
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
      console.log(create);
    };
    const edit = async (editedUserData) => {
      console.log(edit);
    };

    const update = (item) => {
      console.log("updating", item);
    };
    return {
      data,
      setPages,
      edit,
      update,
      create,
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
  z-index: 999,1; /* Ensure the modal is on top of other content */
}
</style>
