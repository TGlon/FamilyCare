<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'Accounts' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Tài Khoản</span>
      </router-link>
      <router-link
        :to="{ name: 'Roles' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Vai Trò</span>
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
        <!-- <button
          type="button"
          class="btn btn-outline-danger mr-3"
          data-toggle="modal"
          data-target="#model-delete-all"
          @click="deleteAll()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button> -->
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#modal-account"
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
        'Tên Người Dùng',
        'Tên Tài Khoản',
        'Password',
        'Vai Trò',
        'Ngày Tạo',
      ]"
      :labels="['name', 'username', 'maskedPassword', 'role', 'createAtformat']"
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
    <!-- <Edit
        :item="data.editValue"
        :class="[data.activeEdit ? 'show-modal' : 'd-none']"
        @cancel="data.activeEdit = false"
        @edit="edit(data.editValue)"
      /> -->
  </div>
</template>

<script>
import Table from "../../components/table/tbl_account.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import User from "../../services/user.service";
import { ref, reactive, computed, onBeforeMount } from "vue";
import {
  http_create,
  http_getAll,
  http_deleteOne,
  http_getOne,
  http_update,
} from "../../assets/js/common.http";
import { formatCreatedAt } from "../../assets/js/common.format";
import Account from "../../services/account.services";
import Add from "./add.vue";
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
    Pagination,
    Add,
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
        return value.User ? value.User.name.toLocaleLowerCase() : "";
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
    const maskPassword = (password) => {
      return "*".repeat(password.length);
    };
    const setPages = computed(() => {
      if (data.items.length > 0) {
        if (setNumberOfPages.value == 0 || data.entryValue == "All") {
          data.entryValue = data.items.length;
          data.numberOfPages = 1;
        } else data.numberOfPages = setNumberOfPages.value;
        data.startRow = (data.currentPage - 1) * data.entryValue + 1;
        data.endRow = data.currentPage * data.entryValue;
        const sortedAccounts = filtered.value.sort((a, b) => {
          // Move accounts with role "Admin" to the top
          const roleA = a.Role ? a.Role.name : "";
          const roleB = b.Role ? b.Role.name : "";

          if (roleA === "Admin" && roleB !== "Admin") {
            return -1;
          } else if (roleA !== "Admin" && roleB === "Admin") {
            return 1;
          } else {
            // If roles are the same or both are not "Admin", maintain the original order
            return 0;
          }
        });
        return filtered.value
          .map((item) => {
            return {
              ...item,
              name: item.User ? item.User.name : "",
              role: item.Role ? item.Role.name : "",
              createAtformat: formatCreatedAt(item.createdAt),
              maskedPassword: maskPassword(item.password),
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
      const UserData = {
        name: data.itemAdd.name,
        passport: data.itemAdd.passport,
        insurance: data.itemAdd.insurance,
        digital_identity: data.itemAdd.digital_identity,
        birthday: data.itemAdd.birthday,
        gender: data.itemAdd.gender,
        phone: data.itemAdd.phone,
        email: data.itemAdd.email,
        nation: data.itemAdd.nation,
        ethnic: data.itemAdd.ethnic,
        address: data.itemAdd.address,
      };

      try {
        const CreateUser = await http_create(User,UserData);
        // console.log(CreateUser);
        const userId = CreateUser.document._id;
        // console.log(userId);
        const AccountData = {
          username: data.itemAdd.username,
          password: data.itemAdd.password,
          UserId: userId,
          roleId: data.itemAdd.role,
        };

        const CreateAccount = await http_create(Account, AccountData);

        // Check if CreateAccount was successful
        if (CreateAccount) {
          alert_success("Tạo Thành Công", "Bạn đã tạo user thành công!");
          refresh();
        } else {
          alert_error("Error", "Error creating user account.");
        }
      } catch (error) {
        // Handle errors that may occur during the process
        console.error("Error creating user:", error);
        alert("Error creating user.");
      }
    };

    const refresh = async () => {
      data.items = await http_getAll(Account);
      //   console.log(data.items);
    };
    const deleteOne = async(value) => {
      // console.log(value);
      // const dltAcc = await http_deleteOne(Account, value);
      const isConfirmed = await alert_delete(
        `Xoá Hộ Gia Đình`,
        `Bạn có chắc chắn muốn xoá account không ?`
      );
      // console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Account, value);
        alert_success(
          `Xoá Hộ Gia Đình`,
          `Bạn đã xoá thành công`
        );
        refresh();
      }
    }

    onBeforeMount(async () => {
      refresh();
      // console.log(data.items);
    });
    const activeMenu = ref(1);
    return {
      data,
      setPages,
      create,
      activeMenu,deleteOne
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
