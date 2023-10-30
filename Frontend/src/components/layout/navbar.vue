<script>
import {
  ref,
  defineEmits,
  inject,
  reactive,
  onUnmounted,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import { alert_delete, alert_noti } from "../../assets/js/common.alert";
import socket from "../../socket";
import Appointment from "../../services/appointment.service";
import {
  http_getAll,
  http_create,
  http_getOne,
  http_deleteOne,
  http_update,
} from "../../assets/js/common.http";
import { onBeforeMount } from "vue";
import { formatDateTime, formatDate } from "../../assets/js/common.format";
import moment from "moment";
import Notification from "../../services/notification.service";
export default {
  props: {},
  computed: {
    sortedNotifications() {
      return this.data.notice.documents.slice().sort((a, b) => {
        // Sort by createdAt in ascending order
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    },
  },
  setup(props, ctx) {
    // const showSearch = ref(false);
    const count = ref(0);
    const data = reactive({
      UserName: sessionStorage.getItem("UserName"),
      role: sessionStorage.getItem("role"),
      notice: {},
      selectedItem: {},
    });
    const emit = inject("emit");
    const updateMenuResponsive = () => {
      console.log("starting");
      ctx.emit("updateMenuResponsive", "true");
    };
    //socket
    const isRead = async (notice) => {
      data.selectedItem = notice;
      // console.log(data.selectedItem);
      if (notice.isRead == false) {
        notice.isRead = true;
        const item1 = await http_update(Notification, notice._id);
        // console.log(item1);
        if (count.value > 0) count.value--;
      }
      alert_noti(
        "Chi Tiết Thông Báo",
        notice.title +
          "\n" +
          "Nội dung: " +
          notice.content +
          "\n" +
          "Địa Điểm:" +
          notice.Appointment.place +
          "\n" +
          "Được tạo lúc: " +
          formatDateTime(notice.createdAt)
      );
    };

    const refresh = async () => {
      // ///////////////////
      const Id = sessionStorage.getItem("UserId");
      data.notice = await http_getOne(Notification, Id);
      // console.log(data.notice);
      count.value = 0;
      for (const value of data.notice.documents) {
        if (value.isRead == false) {
          count.value++;
        }
      }
      if (
        socket.on("appointmentNoti", async () => {
          count.value++;
          location.reload();
        })
      );
      socket.on("notiEveryDay", async () => {
        // ///////////////////
        // lấy ngày hiện tại
        const currentdate = moment().format("YYYY-MM-DD");
        // console.log(currentdate);
        // Lấy id User
        const _idUser = sessionStorage.getItem("UserId");
        // console.log(_idUser);
        // Load tất cả cuộc hẹn
        const loadapp = await http_getAll(Appointment);
        // console.log(loadapp);
        // Lọc và hiển thị chỉ các cuộc hẹn có UserId bằng với _idUser
        const filteredAppointments = loadapp.filter(
          (appointment) => appointment.UserId === _idUser
        );
        // duyệt qua kết quả lọc
        for (const appointment of filteredAppointments) {
          // lấy ra ngày của các cuộc hẹn
          const getDateAppointment = moment(
            appointment.start_date,
            "YYYY-MM-DD"
          );
          // nếu ngày hiện tại trước ngày diễn ra cuộc hẹn
          if (moment(currentdate).isBefore(getDateAppointment, "day")) {
            // console.log("appointment:", appointment);
            // Kiểm tra nếu getDateAppointment bằng currentdate + 1
            // Nếu ngày cuộc hẹn = ngày hiện tại + 1
            if (
              moment(currentdate)
                .add(1, "days")
                .isSame(getDateAppointment, "day")
            ) {
              // console.log(
              //   "getDateAppointment is equal to currentdate + 1",
              //   appointment
              // );
              // Thêm dữ liệu cho thông báo
              const NoticeData = {
                title: `Thông Báo`,
                content: `Sắp Tới Ngày Hẹn ${
                  appointment.appointment_type
                } Tại ${appointment.place} Ngày ${formatDate(
                  appointment.start_date
                )}`,
                isRead: false,
                AppointmentId: appointment._id,
              };
              // console.log("noticedata", NoticeData);
              // const AddNoti = await http_create(Notification, NoticeData);
              // console.log("DataBaseNoti", AddNoti);
              // lấy ra tất cả thông báo
              const getAllNoti = await http_getAll(Notification);
              // console.log(getAllNoti);
              if (getAllNoti.documents && Array.isArray(getAllNoti.documents)) {
                // Kiểm tra xem NoticeData đã tồn tại trong getAllNoti.documents
                const existingNotice = getAllNoti.documents.some(
                  (notice) => notice.AppointmentId === NoticeData.AppointmentId
                );

                if (existingNotice) {
                  console.log("NoticeData đã tồn tại trong cơ sở dữ liệu.");
                  // Không cần thực hiện http_create
                } else {
                  console.log(
                    "NoticeData chưa tồn tại trong cơ sở dữ liệu. Thực hiện http_create."
                  );
                  const AddNoti = await http_create(Notification, NoticeData);
                  // console.log("DataBaseNoti", AddNoti);
                  if (!AddNoti.error) {
                    // console.log("noti", NoticeData);
                    socket.emit("appointment", NoticeData);
                  }
                }
              }
            }
          }
        }
      });
    };
    const hasNotification = ref(false);
    const showNotification = ref(false);
    const toggleNotification = () => {
      showNotification.value = !showNotification.value;
      hasNotification.value = false;
    };
    const toggleNotification1 = () => {
      showNotification.value = false;
      hasNotification.value = false;
    };
    // const TB = async () => {
    //   socket.on("appointmentNoti", async () => {
    //     count.value++;
    //   });

    // };
    // onBeforeMount(async () => {
    //   refresh();
    //   // TB();
    // });
    const deleteOne = async (_id) => {
      const notification = await http_getOne(Notification, _id);
      const result = await http_deleteOne(Notification, _id);
      refresh();
      if (count.value > 0) count.value--;
    };
    const deleteAll = async () => {
      const id = sessionStorage.getItem("UserId");
      const notification = await http_getOne(Notification, id);
      const isConfirmed = await alert_delete(
        `Xoá thông báo`,
        `Bạn có chắc chắn muốn xoá tất cả thông báo không ?`
      );
      if (isConfirmed == true) {
        const result = await Notification.deleteAll(id);
        alert_success(
          `Xoá thông báo`,
          `Bạn đã xoá thành công tất cả thông báo`
        );
        await refresh();
        count.value = 0;
      }
    };
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
    const selectRef = ref(null);
    const handleClickOutside1 = (event) => {
      if (!selectRef1.value.contains(event.target)) {
        // toggleNotification1();
        toggleDropdown1();
      }
    };
    const handleClickOutside = (event) => {
      if (!selectRef.value.contains(event.target)) {
        toggleNotification1();
        // toggleDropdown1();
      }
    };
    onMounted(async () => {
      await refresh();
      document.addEventListener("click", handleClickOutside1);
      document.addEventListener("click", handleClickOutside);
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
      updateMenuResponsive,
      deleteOne,
      selectRef,
      logout,
      toggleDropdown,
      showDropdown,
      selectRef1,
      handleClickOutside1,
      getAvatarUrl,
      getAvatarColor,
      count,
      hasNotification,
      showNotification,
      toggleDropdown1,
      toggleNotification,
      toggleNotification1,
      formatDateTime,
      handleClickOutside,
      deleteAll,
      isRead,
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
    <div
      class="d-flex align-content-center justify-content-between"
      ref="selectRef"
    >
      <router-link to="/" class="text-dark d-flex align-items-center">
        <span class="material-symbols-outlined cursor-pointer">home</span>
      </router-link>

      <!-- <a class="text-dark d-flex align-items-center mx-2"
        ><span class="material-symbols-outlined cursor-pointer">
          translate
        </span></a
      >
      <a class="text-dark d-flex align-items-center"
        ><span class="material-symbols-outlined cursor-pointer">
          light_mode
        </span></a
      > -->
      <a
        class="text-dark d-flex align-items-center mx-2 notification-icon"
        @click="toggleNotification"
        ><span class="material-symbols-outlined cursor-pointer">
          notifications
        </span>
        <span class="notification-dot">{{ count }}</span>
      </a>
      <div v-if="showNotification" class="notification-dropdown">
        <h6 class="font-weight-bold mb-2">THÔNG BÁO</h6>
        <div
          style="align-items: center"
          class="d-flex justify-content-between mb-0 line"
          v-for="notice in sortedNotifications"
          :key="notice._id"
        >
          <!-- Notification details -->
          <p @click="isRead(notice)" class="NoticeDetails">
            <strong>{{ notice.title }}</strong>
            <br />{{ notice.content }}<br /><span style="font-size: 12px;">{{ formatDateTime(notice.createdAt) }}</span>
          </p>

          <!-- Notification icons -->
          <p class="notify-icon">
            <span
              :style="{ color: notice.isRead ? 'gray' : 'blue' }"
              style="font-size: 20px"
              class="material-symbols-outlined"
            >
              fiber_manual_record
            </span>
            <span
              style="font-size: 20px; color: black; cursor: pointer"
              @click="deleteOne(notice._id)"
              class="material-symbols-outlined none"
            >
              close
            </span>
          </p>
        </div>
        <button @click="deleteAll()" class="clearNotification">
          Xóa Thông Báo
        </button>
      </div>

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
.notification-icon {
  position: relative;
}
.notification-dot {
  position: absolute;
  top: 37%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 17px;
  height: 17px;
  background-color: var(--red);
  border-radius: 50%;
  display: inline-block;
  color: white;
  font-weight: bold;
  text-align: center;
  line-height: 17px;
  margin-left: 5px;
  cursor: pointer;
}
.clearNotification {
  position: sticky;
  bottom: 10px; /* Adjust this value as needed */
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  padding: 10px; /* Add padding for better visibility */
  font-weight: bold;
}
.clearNotification::after {
  content: "";
  position: absolute;
  top: 128%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 20px;
  background-color: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 1, "wght" 300, "GRAD" 0, "opsz" 48;
}

h6 {
  border-bottom: 1px solid #ccc;
  height: 50px;
  padding-top: 10px;
  color: black;
}
.NoticeDetails {
  height: auto;
  padding: 5px;
  margin: 0;
  cursor: pointer;
  flex-basis: 350px;
  color: black;
}
.line {
  border-bottom: 1px solid rgb(216, 217, 218);
  padding-bottom: 5px;
}
.none {
  display: none;
}
.line:hover .none {
  display: block;
}
.line:hover {
  background-color: aliceblue;
}
.notify-icon {
  position: relative;
}
.notification-dropdown {
  position: absolute;
  top: 68px;
  right: 0;
  width: 400px;
  max-height: calc(85vh - 120px); /* Adjust this value as needed */
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  padding: 10px;
  margin-right: 14px;
  z-index: 99999;
  /* display: grid;
  grid-template-columns: 250px 100px;
  grid-gap: 10px; */
}
.notification-dropdown::before {
  content: "";
  position: absolute;
  top: -10px;
  left: calc(50% - 18px);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}
.markAllAsRead {
  border: 1px solid rgb(188, 229, 255);
  border-radius: 8px;
  background-color: rgb(188, 229, 255);
  font-size: 12px;
  padding: 5px;
  color: rgb(69, 69, 246);
  font-weight: bold;
}
.markUnread {
  border: 1px solid rgb(188, 229, 255);
  border-radius: 8px;
  /* background-color:  rgb(188, 229, 255); */
  font-size: 12px;
  padding: 5px;
  color: rgb(69, 69, 246);
  font-weight: bold;
}
</style>
