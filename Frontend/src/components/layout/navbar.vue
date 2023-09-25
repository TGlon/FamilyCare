<script>
import { ref, defineEmits, inject, reactive, onUnmounted, onMounted } from "vue";
import { useRouter } from "vue-router";
import { alert_delete } from "../../assets/js/common.alert";
export default {
  props: {},
  setup(props, ctx) {
    // const showSearch = ref(false);
    const data = reactive({
      UserName: sessionStorage.getItem("UserName"),
      role: sessionStorage.getItem("role"),
    });
    // const emit = inject("emit");
    // const updateMenuResponsive = () => {
    //   console.log("starting");
    //   ctx.emit("updateMenuResponsive", "true");
    // };
    // logout
    const showDropdown = ref(false);
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };
    const router = useRouter();

    const logout = async () => {
      const isConfirmed = await alert_delete(
        "Đăng xuất",
        "Bạn có chắc chắn muốn đăng xuất?"
      );
      if (isConfirmed == true) {
        // Xóa dữ liệu trong sessionStorage
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("UserId");
        sessionStorage.removeItem("UserName");
        sessionStorage.removeItem("role");
        // Chuyển hướng đến trang đăng nhập
        router.push({ name: "Login" });
      }
    };
    const toggleDropdown1 = () => {
      showDropdown.value = false;
    };
    const selectRef1 = ref(null);
    const handleClickOutside1 = (event) => {
      if (!selectRef1.value.contains(event.target)) {
        // toggleNotification1();
        toggleDropdown1();
      }
    };
    onMounted(async () => {
      document.addEventListener("click", handleClickOutside1);
    });
    // check(token);
    onUnmounted(() => {
      // document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleClickOutside1);
    });
    const getAvatarUrl = (name) => {
      if (name) {
        const words = name.split(" ");
        const lastWord = words[words.length - 1];
        const initials = lastWord.charAt(0).toUpperCase();
        const color = getAvatarColor(initials);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const size = 50;

        canvas.width = size;
        canvas.height = size;

        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();

        context.font = `${size / 2}px sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#FFFFFF";
        context.fillText(initials, size / 2, size / 2);

        return canvas.toDataURL();
      }
      return "";
    };

    const getAvatarColor = (initials) => {
      const colors = [
        "#F44336",
        "#E91E63",
        "#9C27B0",
        "#673AB7",
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
        "#8BC34A",
        "#CDDC39",
        "#FFC107",
        "#FF9800",
        "#FF5722",
      ];
      const index = initials.charCodeAt(0) % colors.length;
      return colors[index];
    };

    return {
      data,
      // updateMenuResponsive,
      // showSearch,
      // toggleSearch,
      logout,
      toggleDropdown,
      showDropdown,
      selectRef1,
      handleClickOutside1,
      getAvatarUrl,
      getAvatarColor,
    };
  },
};
</script>

<template>
  <nav
    class="w-100 d-flex align-items-center justify-content-between border-nav"
  >
    <a
      class="h5 my-auto d-none d-xl-block ml-3"
      style="color: rgb(38, 169, 224); font-weight: bold"
      >HỆ THỐNG QUẢN LÝ SỨC KHỎE GIA ĐÌNH</a
    >
    <a class="d-xl-none d-sm-block text-dark h5 my-auto"
      ><span
        class="material-symbols-outlined cursor-pointer"
        @click="$emit('showMenu')"
      >
        menu
      </span></a
    >
    <div class="d-flex align-content-center justify-content-between">
      <!-- <div
        v-if="showSearch"
        id="search-box"
        class="text-dark d-flex align-items-center"
      >
        <input type="text" placeholder="Nhập từ khóa tìm kiếm....." />
      </div>
      <a class="text-dark d-flex align-items-center"
        ><span
          class="material-symbols-outlined cursor-pointer"
          @click="toggleSearch"
        >
          search
        </span></a
      > -->
      <router-link to="/" class="text-dark d-flex align-items-center">
  <span class="material-symbols-outlined cursor-pointer">home</span>
</router-link>

      <a class="text-dark d-flex align-items-center mx-2" 
        ><span class="material-symbols-outlined cursor-pointer">
          translate
        </span></a
      >
      <a class="text-dark d-flex align-items-center"
        ><span class="material-symbols-outlined cursor-pointer">
          light_mode
        </span></a
      >
      <a class="text-dark d-flex align-items-center mx-2"
        ><span class="material-symbols-outlined cursor-pointer">
          notifications
        </span></a
      >
      <div
        class="d-flex align-content-center mr-3 my-1 cursor-pointer"
        @click="toggleDropdown"
        ref="selectRef1"
      >
      <img
          class="rounded-circle cursor-pointer"
          :src="getAvatarUrl(data.UserName)"
          alt="Avatar"
        />
        <div
          class="d-xl-flex color-dark d-none flex-column align-items-center justify-content-center ml-2"
        >
          <span class="size-14">{{ data.UserName }}</span>
          <span class="size-14" v-if="data.role === 'Admin'">{{
            data.role
          }}</span>
        </div>
      </div>
    </div>
  </nav>
  <div v-if="showDropdown" class="logout">
    <span @click="logout" class="btnlogout">
      <i class="fas fa-sign-out-alt" style="font-size: 20px"></i>
      <span class="logout-text">Đăng Xuất</span>
    </span>
  </div>
</template>

<style scoped>
.logout {
  position: absolute;
  top: 68px;
  right: 0;
  width: 200px;
  height: 40px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  /* padding: 15px; */
  padding: auto;
  margin-right: 14px;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btnlogout {
  color: var(--dark);
  /* margin-left: 30px; */
  margin: auto;
  cursor: pointer;
  font-size: 16px;
}
.btnlogout:hover {
  color: darkred;
  text-decoration: underline;
}
.logout-text {
  margin-left: 10px;
}
.material-symbols-outlined {
  font-variation-settings: "FILL" 1, "wght" 300, "GRAD" 0, "opsz" 48;
}
.color-dark {
  color: var(--dark);
}
.border-nav {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.avatar {
  width: 50px;
  height: 50px;
}
.italic-text {
  font-style: italic;
}
.cursor-pointer {
  cursor: pointer;
}
.font-size-13 {
  font-size: 13px;
}
</style>
