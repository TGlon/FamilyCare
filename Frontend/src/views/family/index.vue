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
          @click="deleteMany()"
        >
          <span id="delete-all" class="mx-2">Xoá</span>
        </button> -->
        <!-- <DeleteAll :items="data.items" /> -->
        <button
          type="button"
          class="btn btn-outline-primary"
          data-toggle="modal"
          data-target="#modal-addmember"
        >
          <span id="add" class="mx-2">Thêm Thành Viên</span>
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
        'Họ Tên',
        'Mã Y Tế',
        'CCCD/CMND',
        'Ngày Sinh',
        'Giới Tính',
        'SĐT',
        'Mối Quan Hệ',
      ]"
      :labels="[
        'name',
        'insurance',
        'passport',
        'birthday',
        'gender',
        'phone',
        'relationship',
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
import Table from "../../components/table/tbl_famrls.vue";
import Search from "../../components/form/search.vue";
import Select from "../../components/form/select.vue";
import Pagination from "../../components/table/pagination.vue";
import Add from "./add.vue";
import Edit from "../family/edit.vue";
import { ref, reactive, computed, onBeforeMount } from "vue";
import {
  http_create,
  http_update,
  http_getOne,
  http_deleteOne,
  http_getAllByUserId,
  http_getAllUserIdByFamilyId,
  http_findAccountByPassportAndName,
  http_findUserFamilyByUserId,
  http_deleteOneUsrFam,
  http_getAll
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
    Add,
    Select,
    Pagination,
    Edit,
    // AddRela
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
      itemAdd: {
        name: "",
        address: "",
        insurance: "",
        passport: "",
        birthday: "",
        gender: "",
        phone: "",
        digital_identity: "",
        email: "",
        nation: "",
        ethnic: "",
      },
      relationship: {},
      familyadd: {},
      activeEdit: false,
      editValue: {
        _id: "",
        name: "",
        insurance: "",
        passport: "",
        birthday: "",
        gender: "",
        phone: "",
        relationship: "",
      },
      matchingUserFamilies: [],
      // a: [],
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
      const existingUser = await http_findAccountByPassportAndName(
        User,
        data.itemAdd.name,
        data.itemAdd.passport
      );
      // console.log("ex", existingUser);
      if (!existingUser.error) {
        const idUser = existingUser._id;
        // console.log(idUser);
        const userFamilyData = {
          UserId: idUser,
          FamilyId: data.familyadd.family,
          relationship: data.relationship.relationship,
        };
        const userFamilyResult = await http_create(User_Family, userFamilyData);
        if (!userFamilyResult.error) {
          // Both user and user_family entries were created successfully
          alert_success(
            `Thêm Thành Viên`,
            `Thành viên đã được tạo mối quan hệ thành công.`
          );
          refresh();
        } else {
          alert_error(`Thêm Quan Hệ`, `${userFamilyResult.msg}`);
        }
      } else {
        alert_error("Lỗi", "Thành Viên Không Tồn Tại Trong Hệ Thống");
      }
      // try {
      //   // Step 1: Create a user entry in the User table
      //   const userResult = await http_create(User, data.itemAdd);

      //   if (!userResult.error) {
      //     const userId = userResult.document._id; // Get the _id of the newly created user

      //     // Step 2: Create an entry in the User_Family table
      //     const userFamilyData = {
      //       UserId: userId, // Use the userId obtained above
      //       FamilyId: data.familyadd.family, // Assuming data.familyadd has _id property
      //       relationship: data.relationship.relationship,
      //     };
      //     // console.log("User_Family:", userFamilyData);
      //     const userFamilyResult = await http_create(
      //       User_Family,
      //       userFamilyData
      //     );

      //     if (!userFamilyResult.error) {
      //       // Both user and user_family entries were created successfully
      //       alert_success(
      //         `Thêm Thành Viên`,
      //         `Thành viên ${userResult.document.name} đã được tạo thành công.`
      //       );
      //       refresh();
      //     } else {
      //       alert_error(`Thêm Quan Hệ`, `${userFamilyResult.msg}`);
      //     }
      //   } else {
      //     alert_error(`Thêm Thành Viên`, `${userResult.msg}`);
      //   }
      // } catch (error) {
      //   console.error("Error:", error);
      // }
    };

    // const deleteOne = async (_id) => {
    //   const user = await http_getOne(User, _id);
    //   // console.log("deleting", user);
    //   const isConfirmed = await alert_delete(
    //     `Xoá Thành Viên`,
    //     `Bạn có chắc chắn muốn xoá ${user.name} không ?`
    //   );
    //   // console.log(isConfirmed);
    //   if (isConfirmed == true) {
    //     const result = await http_deleteOne(User, _id);
    //     // console.log("Name:", result);
    //     alert_success(
    //       `Xoá Thành Viên`,
    //       `Bạn đã xoá thành công ${result.document.name}`
    //     );
    //     refresh();
    //   }
    // };
    const deleteOne = async (_id) => {
      try {
        // Step 1: Find the userFamily entry by user _id
        const user = await http_getOne(User, _id);
        // console.log(user);
        const userFamily = await http_findUserFamilyByUserId(
          User_Family,
          user._id
        );
        // console.log(userFamily);
        // console.log(userFamily.UserId);
        // console.log(userFamily.FamilyId);
        if (userFamily) {
          // Step 2: Delete the userFamily entry
          const result = await http_deleteOneUsrFam(
            User_Family,
            userFamily.UserId,
            userFamily.FamilyId
          );

          if (result) {
            alert_success(
              `Xoá Thành Viên`,
              `Bạn đã xoá thành công quan hệ cho ${user.name}`
            );
            refresh();
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const edit = async (editedUserData) => {
      try {
        const updatedUserResult = await http_update(
          User,
          editedUserData._id,
          editedUserData
        );
        // console.log(updatedUserResult);
        if (!updatedUserResult.error) {
          alert_success(
            `Cập Nhật Thành Viên`,
            `Thông tin thành viên đã được cập nhật thành công.`
          );
          refresh();
        } else {
          alert_error(`Cập Nhật Thành Viên`, `${updatedUserResult.msg}`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const update = (item) => {
      console.log("updating", item);
    };

    // Hàm refresh này hiển thị thông tin người tạo gia đình
    const refresh = async () => {
      const loggedInUserId = sessionStorage.getItem("UserId");
      try {
        data.matchingUserFamilies = await http_getAllByUserId(
          User_Family,
          loggedInUserId
        );
        // console.log("mactchinguserfamily:", data.matchingUserFamilies);
      } catch (error) {
        console.log("Lỗi", error);
      }
      // Tạo một mảng mới để lưu trữ tất cả các FamilyId
      const familyIds = [];
      // Duyệt qua mảng matchingUserFamilies và lấy ra tất cả các _id của FamilyId
      data.matchingUserFamilies.forEach((item) => {
        familyIds.push(item.FamilyId);
      });
      // In ra tất cả các _id của FamilyId
      // console.log("FamilyIds:", familyIds);
      // Tạo một mảng tạm để lưu trữ các thông tin người dùng
      const temporaryUserArray = [];
      // Lặp qua từng FamilyId trong mảng familyIds
      for (const familyId of familyIds) {
        try {
          // Gọi hàm http_getAllUserIdByFamilyId với familyId cụ thể
          const documents = await http_getAllUserIdByFamilyId(
            User_Family,
            familyId
          );
          // Tạo một mảng để lưu trữ các UserId cho familyId cụ thể
          const userIds = [];
          // Lặp qua danh sách tài liệu và lấy ra UserId
          documents.forEach((document) => {
            userIds.push(document.UserId);
          });
          // console.log(`UserIds for FamilyId ${familyId}:`, userIds);
          for (const userId of userIds) {
            try {
              const user = await http_getOne(User, userId);
              const userRelationship = await http_getAllByUserId(
                User_Family,
                userId
              );
              const relationships = userRelationship.map(
                (item) => item.relationship
              );
              const userWithRelationship = {
                user,
                relationships,
              };
              // Thêm thông tin người dùng vào mảng tạm thời
              temporaryUserArray.push(userWithRelationship);
            } catch (error) {
              console.error(`Error finding User with UserId ${userId}:`, error);
            }
          }
        } catch (error) {
          console.error(`Error for FamilyId ${familyId}:`, error);
        }
      }
      data.items = temporaryUserArray.map((userWithRelationship) => {
        // Lấy thông tin user từ userWithRelationship
        const { user, relationships } = userWithRelationship;
        return {
          _id: user._id,
          name: user.name,
          gender: user.gender,
          birthday: user.birthday,
          address: user.address,
          passport: user.passport,
          digital_identity: user.digital_identity,
          email: user.email,
          ethnic: user.ethnic,
          nation: user.nation,
          insurance: user.insurance,
          phone: user.phone,
          relationship: relationships[0],
          // relationship: relationships[relationships.length - 1],
        };
      });
      // Nối (concatenate) mảng tạm vào mảng data.items
      // data.items = data.items.concat(temporaryUserArray);
      // Loại bỏ các phần tử trùng lặp dựa trên trường Passport
      data.items = data.items.filter((user, index, self) => {
        // Sử dụng indexOf để kiểm tra xem user hiện tại có trùng với các user trước đó không
        return index === self.findIndex((u) => u.name === user.name);
      });

      // console.log("data:", data.items);
    };

    // Hàm refresh này không hiển thị thông tin người tạo gia đình
    // const refresh = async () => {
    //   const loggedInUserId = sessionStorage.getItem("UserId");
    //   try {
    //     data.matchingUserFamilies = await http_getAllByUserId(
    //       User_Family,
    //       loggedInUserId
    //     );
    //   } catch (error) {
    //     console.log("Lỗi", error);
    //   }

    //   const familyIds = [];
    //   data.matchingUserFamilies.forEach((item) => {
    //     familyIds.push(item.FamilyId);
    //   });

    //   const temporaryUserArray = [];

    //   for (const familyId of familyIds) {
    //     try {
    //       const documents = await http_getAllUserIdByFamilyId(
    //         User_Family,
    //         familyId
    //       );

    //       const userIds = [];
    //       documents.forEach((document) => {
    //         userIds.push(document.UserId);
    //       });

    //       for (const userId of userIds) {
    //         // Kiểm tra xem userId có khớp với người đăng nhập không
    //         if (userId !== loggedInUserId) {
    //           try {
    //             const user = await http_getOne(User, userId);
    //             const userRelationship = await http_getAllByUserId(
    //               User_Family,
    //               userId
    //             );
    //             const relationships = userRelationship.map(
    //               (item) => item.relationship
    //             );
    //             const userWithRelationship = {
    //               user,
    //               relationships,
    //             };
    //             temporaryUserArray.push(userWithRelationship);
    //           } catch (error) {
    //             console.error(
    //               `Error finding User with UserId ${userId}:`,
    //               error
    //             );
    //           }
    //         }
    //       }
    //     } catch (error) {
    //       console.error(`Error for FamilyId ${familyId}:`, error);
    //     }
    //   }

    //   data.items = temporaryUserArray.map((userWithRelationship) => {
    //     const { user, relationships } = userWithRelationship;
    //     return {
    //       _id: user._id,
    //       name: user.name,
    //       gender: user.gender,
    //       birthday: user.birthday,
    //       address: user.address,
    //       passport: user.passport,
    //       digital_identity: user.digital_identity,
    //       email: user.email,
    //       ethnic: user.ethnic,
    //       nation: user.nation,
    //       insurance: user.insurance,
    //       phone: user.phone,
    //       relationship: relationships[0],
    //     };
    //   });

    //   data.items = data.items.filter((user, index, self) => {
    //     return index === self.findIndex((u) => u.name === user.name);
    //   });

    //   // console.log("data:", data.items);
    // };
    // const refresh1 = async () => {
    //   data.a = await http_getAll(User_Family);
    //   console.log("data.a", data.a);
    // }
    // Hàm callback được gọi trước khi component được mount (load)
    onBeforeMount(async () => {
      refresh();
      // refresh1()
      // console.log(data.items);
    });
    const activeMenu = ref(1);
    return {
      data,
      setPages,
      deleteOne,
      edit,
      update,
      create,
      activeMenu,
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
