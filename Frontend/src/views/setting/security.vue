<template>
  <div class="border-box d-flex flex-column ml-2">
    <!-- Menu -->
    <div class="d-flex menu my-3 mx-3 justify-content-end">
      <router-link
        :to="{ name: 'Settings' }"
        @click="activeMenu = 1"
        :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Tài Khoản</span>
      </router-link>
      <router-link
        :to="{ name: 'Securitys' }"
        @click="activeMenu = 2"
        :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Bảo Mật</span>
      </router-link>
      <router-link
        :to="{ name: '' }"
        @click="activeMenu = 3"
        :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Thông Báo</span>
      </router-link>
    </div>

    <div class="card m-3">
      <div class="card-body">
        <h4 class="card-title font-weight-bold mb-4">Đổi Mật Khẩu</h4>
        <form>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="currentPassword">Mật Khẩu Hiện Tại</label>
                <input
                  type="password"
                  class="form-control"
                  id="currentPassword"
                  name="currentPassword"
                  v-model="data.currentPassword"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="newPassword">Mật Khẩu Mới</label>
                <input
                  type="password"
                  class="form-control"
                  id="newPassword"
                  name="newPassword"
                  v-model="data.newPassword"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="confirmPassword">Nhập Lại Mật Khẩu</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  v-model="data.confirmPassword"
                />
              </div>
            </div>
          </div>

          <div class="border-hr"></div>

          <div class="row mt-3">
            <div class="col-md-6">
              <button
                type="button"
                class="btn btn-primary mr-3"
                @click="updatePassword"
              >
                Lưu Thay Đổi
              </button>
              <!-- <button type="button" class="btn btn-secondary">Thiết Lập Lại</button> -->
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Account from "../../services/account.services";
import { reactive, onBeforeMount } from "vue";
import {
  http_update,
  http_findAccountByUserId,
} from "../../assets/js/common.http";
import { alert_error, alert_success } from "../../assets/js/common.alert";
export default {
  components: {},
  setup() {
    const data = reactive({
      item: {},
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    });

    const updatePassword = async () => {
      try {
        if (data.newPassword !== data.confirmPassword) {
          alert_error(
            "Lỗi Cập Nhật Thông Tin",
            "Mật khẩu mới và nhập lại mật khẩu không khớp."
          );
          return;
        } else if (data.currentPassword !== data.item.accounts[0].password) {
          console.log(data.currentPassword);
          console.log(data.item.password);
          alert_error(
            "Lỗi Cập Nhật Thông Tin",
            "Mật khẩu hiện tại không đúng."
          );
          return;
        } else {
          const updatedData = {
            ...data.item,
            password: data.newPassword,
          };
          const result = await http_update(Account, data.item.accounts[0]._id ,updatedData);
          console.log(result);
          alert_success(
            "Cập Nhật Thông Tin",
            "Mật khẩu đã được thay đổi thành công."
          );
        }
      } catch (error) {
        alert_error("Lỗi Cập Nhật Thông Tin", error);
      }
    };

    const refresh = async () => {
      const id = sessionStorage.getItem("UserId");
      data.item = await http_findAccountByUserId(Account, id);
      console.log(data.item);
      // Truy cập đối tượng đầu tiên trong mảng "accounts"
      const firstAccount = data.item.accounts[0];
      // Truy cập trường "password" trong đối tượng đó
      const password = firstAccount.password;
      console.log(password);
    };

    onBeforeMount(async () => {
      refresh();
    });

    return {
      data,
      updatePassword,
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
</style>
