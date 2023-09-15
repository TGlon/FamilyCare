<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'Family' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Quản Lý Hộ Khẩu</span>
      </router-link>
      <router-link
        :to="{ name: 'FamilyTypes' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Quản Lý Gia Đình</span>
      </router-link>
    </div>
    <!-- Filter -->

    <!-- Search -->
    <div class="border-hr mb-3"></div>
    <div class="d-flex justify-content-between mx-3 mb-3">
      <div class="d-flex justify-content-start">
        <!-- <Select
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
          /> -->
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
          data-target="#modal-addfam"
        >
          <span id="add" class="mx-2">Thêm</span>
        </button>
        <Add :item="data.itemAdd" @create="create" />
      </div>
    </div>
    <!-- {{ data.itemAdd }} -->
    <!-- Table -->
    <Table
      :items="setPages"
      :fields="['Tên Gia Đình', 'Địa Chỉ', 'SĐT']"
      :labels="['name', 'address', 'phone']"
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
import Table from "../../components/table/tbl_fam.vue";
import Pagination from "../../components/table/pagination.vue";
import Add from "../family/addfam.vue";
import Edit from "../family/editfam.vue";
import { reactive, computed, onBeforeMount } from "vue";
import {
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
  http_getAllByFamilyId,
  http_getAllByUserId,
} from "../../assets/js/common.http";
import Family from "../../services/family.service";
import User_Family from "../../services/user_family.service";
import {
  alert_delete,
  alert_success,
  alert_error,
} from "../../assets/js/common.alert";
export default {
  components: {
    Table,
    Pagination,
    Add,
    Edit,
  },
  setup() {
    const data = reactive({
      items: [],
      UsrIdFam: [],
      entryValue: 5,
      numberOfPages: 1,
      totalRow: 0,
      startRow: 0,
      endRow: 0,
      currentPage: 1,
      searchText: "",
      activeMenu: 1,
      itemAdd: {
        name: "",
        address: "",
        phone: "",
      },
      activeEdit: false,
      editValue: {
        _id: "",
        name: "",
      },
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
      } else return data.items.documents;
    });

    // Methods
    // const create = async () => {
    //   // console.log(data.itemAdd);
    //   const result = await http_create(Family, data.itemAdd);
    //   // console.log("result", result);

    //   if (result) {
    //     if (!result.error) {
    //       alert_success(
    //       `Thêm Hộ Gia Đình`,
    //       `Gia đình ${result.document.name} đã được tạo thành công.`
    //     );
    //       refresh();
    //     } else {
    //       alert_error(`Thêm Hộ Gia Đình`, `${result.msg}`);
    //     }
    //   } else {
    //     console.log("No result received from the server.");
    //   }
    // };

    const create = async () => {
      try {
        // Tạo hộ gia đình
        const familyResult = await http_create(Family, data.itemAdd);
        // console.log("thongtinne:",data.itemAdd);
        if (familyResult) {
          if (!familyResult.error) {
            // console.log("1");
            // Thông báo thành công khi tạo hộ gia đình
            alert_success(
              `Thêm Hộ Gia Đình`,
              `Gia đình ${familyResult.document.name} đã được tạo thành công.`
            );
            // Lấy thông tin người dùng đăng nhập
            // Lấy UserId từ session storage
            const idne = sessionStorage.getItem("UserId");
            // Tạo bản ghi User_Family
            const userFamilyData = {
              FamilyId: familyResult.document._id, // Lấy _id của gia đình vừa tạo
              UserId: idne,
              relationship: "Chủ Hộ",
            };

            const userFamilyResult = await http_create(
              User_Family,
              userFamilyData
            );

            if (userFamilyResult) {
              if (!userFamilyResult.error) {
                // Thông báo thành công khi tạo bản ghi User_Family
                console.log("Tạo thành công mối quan hệ trong gia đình");
                // Refresh trang sau khi hoàn thành
                refresh();
              } else {
                console.log("Tạo mqh lỗi");
              }
            } else {
              console.log(
                "No result received from the server for User_Family creation."
              );
            }
          } else {
            alert_error(`Thêm Hộ Gia Đình`, `${familyResult.msg}`);
          }
        } else {
          console.log(
            "No result received from the server for Family creation."
          );
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    const deleteOne = async (_id) => {
      const fam = await http_getOne(Family, _id);
      // console.log("deleting", fam);
      const isConfirmed = await alert_delete(
        `Xoá Hộ Gia Đình`,
        `Bạn có chắc chắn muốn xoá ${fam.name} không ?`
      );
      // console.log(isConfirmed);
      if (isConfirmed == true) {
        const result = await http_deleteOne(Family, _id);
        console.log("Name:", result);
        alert_success(
          `Xoá Hộ Gia Đình`,
          `Bạn đã xoá thành công hộ gia đình ${result.document.name}`
        );
        refresh();
      }
    };
    const edit = async (editValue) => {
      console.log(editValue);
      const result = await http_update(Family, editValue._id, editValue);
      if (!result.error) {
        alert_success(`Sửa Gia Đình`, `${result.msg}`);
        refresh();
      } else if (result.error) {
        alert_error(`Sửa Gia Đình`, `${result.msg}`);
      }
    };
    const update = (item) => {
      console.log("updating", item);
    };
    const refresh = async () => {
      const loggedInUserId = sessionStorage.getItem("UserId");
      data.UsrIdFam = await http_getAllByUserId(User_Family, loggedInUserId);
      // console.log("Danh sách User có Id:",data.UsrIdFam);
      if (data.UsrIdFam.length === 0) {
        console.log("UserId không thuộc vào bất kỳ gia đình nào");
      } else {
        const familyIds = data.UsrIdFam.map(
          (userFamily) => userFamily.FamilyId
        );
        // console.log("familyIs:", familyIds);
        // data.items = await http_getAllByFamilyId(Family, familyIds);
        data.items = []; // Khởi tạo mảng items
        for (const familyId of familyIds) {
          const familyData = await http_getAllByFamilyId(Family, familyId);
          data.items.push(...familyData); // Thêm gia đình vào mảng items
        }
        // console.log("Danh sách các gia đình của người dùng:", data.items);
      }
    };
    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      refresh();
    });
    return {
      data,
      setPages,
      deleteOne,
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
  z-index: 99; /* Ensure the modal is on top of other content */
}
</style>
