<script>
import { reactive, ref, defineEmits, defineProps } from "vue";

export default {
  props: {
    activeIndex: {
      type: Number,
      default: 1,
    },
    activeIndexChild: {
      type: Number,
      default: -1,
    },
  },
  setup(props) {
    const data = reactive({
      sidebarToggle: true,
      sidebarTasks: [
        {
          id: 1,
          icon: "dashboard_customize",
          name_icon: "Thống kê",
          name: "Dashboard",
        },
        {
          id: 2,
          icon: "diversity_1",
          name_icon: "Gia Đình",
          name: "Family",
        },
        {
          id: 3,
          icon: "cardiology",
          name_icon: "Sức Khỏe",
          name: "HealthRecords",
        },
        {
          id: 4,
          icon: "vaccines",
          name_icon: "Tiêm Ngừa",
          name: "Vaccinations",
        },
        {
          id: 5,
          icon: "calendar_month",
          name_icon: "Lịch Hẹn",
          name: "Appointments",
        },
        {
          id: 6,
          icon: "medical_services",
          name_icon: "Bệnh Tật",
          name: "Medicals",
        },
        {
          id: 7,
          icon: "settings",
          name_icon: "Cài Đặt",
          name: "Settings",
        },
      ],
    });

    const setActiveMenu = (value) => {
      sessionStorage.setItem("activeMenu", value);
    };
    // const role = sessionStorage.getItem("role");
    // if (role === "Admin") {
    //   data.sidebarTasks.push({
    //     id: 8,
    //     icon: "folder_managed",
    //     name_icon: "Vai Trò",
    //     name: "Settings",
    //   });
    // }
    return {
      data,
      setActiveMenu,
    };
  },
};
</script>

<template>
  <div class="border-sidebar">
    <div class="d-flex flex-column">
      <div id="img-logo" class="d-flex justify-content-center">
        <img class="img border-img" src="../../assets/images/logo-new.png" alt="" />
      </div>
      <div class="mt-3">
        <div
          v-for="(sidebarTask, index) in data.sidebarTasks"
          :key="sidebarTask.id"
          class="d-flex flex-column align-items-center"
        >
          <router-link
            :to="{ name: sidebarTask.name }"
            class="my-2 d-flex overflow-hidden"
            :class="[
              sidebarTask.id == activeIndex
                ? 'border-nav-item'
                : 'none-border-nav-item',
            ]"
            @click="(activeIndex = index + 1), setActiveMenu(activeIndex)"
          >
            <div class="d-flex py-1 align-items-center">
              <span
                class="material-symbols-outlined mx-2 py-1 px-1"
                :class="[
                  sidebarTask.id == activeIndex
                    ? 'none-border-icon'
                    : 'border-icon',
                ]"
              >
                {{ sidebarTask.icon }}
              </span>
              <span class="d-flex align-items-center" style="font-size: 18px">{{
                sidebarTask.name_icon
              }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.border-sidebar {
  border: 1px solid var(--gray);
  border-radius: 5px;
  height: 100%;
  width: 100%;
  /* max-height: 100vh;
  position: fixed;
  top: 0;
  left: 0; */
  overflow-x: hidden;
  overflow-y: hidden;
}
.img {
  width: 245px;
  /* 250px */
}
.border-img {
  border: 1px solid var(--gray);
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
.border-nav-item {
  border: 1px solid var(--gray);
  width: 90%;
  cursor: pointer;
  border-radius: 5px;
  color: rgb(1, 1, 121);
}
.none-border-nav-item {
  width: 90%;
  cursor: pointer;
  border: none;
}

.border-icon {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.none-border-icon {
  border: none;
}
</style>
