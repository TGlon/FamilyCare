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
                <!-- {{ data.day }} -->
                <label for="day">Thời Gian Thông Báo (Ngày)</label>
                <input
                  type="text"
                  class="form-control"
                  id="day"
                  name="day"
                  v-model="data.day"
                  style="width: 170px"
                />
              </div>
              <small
                >Ví Dụ: Nếu Bạn Muốn Thông Báo Trước 1 Ngày. Nhập Vào Số
                1</small
              >
            </div>
          </div>

          <div class="border-hr"></div>

          <div class="row mt-3">
            <div class="col-md-6">
              <button
                type="button"
                class="btn btn-primary mr-3"
                @click="updateTime"
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
import SetTime from "../../services/settime.service";
import { reactive, onBeforeMount } from "vue";
import { http_getAll, http_update } from "../../assets/js/common.http";
import { alert_error, alert_success } from "../../assets/js/common.alert";
import { ref } from "vue";
export default {
  components: {},
  setup() {
    const data = reactive({
      items: [],
      day: "",
    });

    const refresh = async () => {
  try {
    data.items = await http_getAll(SetTime);
    const id = sessionStorage.getItem("UserId");
    data.items = data.items.documents.filter((item) => item.UserId === id);
    console.log(data.items);
    data.day = data.items.length > 0 ? data.items[0].day : "";
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const updateTime = async () => {
  try {
    const id = sessionStorage.getItem("UserId");
    const dataUpdate = {
      day: data.day,
      UserId: id,
    };
    const result = await http_update(SetTime, data.items[0]._id, dataUpdate);
    if (result) {
      alert_success("Thông Báo", "Bạn Đã Cập Nhật Thành Công");
      refresh();
    } else {
      alert_error("Lỗi", "Cập Nhật Thất Bại");
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

    onBeforeMount(async () => {
      refresh();
    });
    const activeMenu = ref(3);
    return {
      data,
      updateTime,activeMenu
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
