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
        :to="{ name: 'Notices' }"
        @click="activeMenu = 3"
        :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
      >
        <span class="size-17">Thông Báo</span>
      </router-link>
    </div>

    <div class="card m-3">
      <div class="card-body">
        <h4 class="card-title font-weight-bold mb-4">Thiết Lập</h4>
        <form>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="currentPassword">Thời Gian Thông Báo</label>
                <input
                  type="text"
                  class="form-control"
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Ví Dụ: Thông Báo Trước 1 Ngày. Nhập Số 1"
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

    });

    

    const refresh = async () => {
      
    };

    onBeforeMount(async () => {
      refresh();
    });

    return {
      data,
    
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
