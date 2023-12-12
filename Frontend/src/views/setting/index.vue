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
        <h4 class="card-title font-weight-bold mb-4">Thông Tin Cá Nhân</h4>
        <form>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="name">Họ Tên</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  name="name"
                  v-model="data.item.name"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="passport">CCCD/CMND</label>
                <input
                  type="text"
                  class="form-control"
                  id="passport"
                  name="passport"
                  v-model="data.item.passport"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="insurance">Mã Y Tế</label>
                <input
                  type="text"
                  class="form-control"
                  id="insurance"
                  v-model="data.item.insurance"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="digital_identity">Nghề Nghiệp</label>
                <input
                  type="text"
                  class="form-control"
                  id="digital_identity"
                  v-model="data.item.digital_identity"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="birthday">Ngày Sinh</label>
                <input
                  type="date"
                  class="form-control"
                  id="birthday"
                  v-model="data.item.birthday"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="gender">Giới Tính</label>
                <input
                  type="text"
                  class="form-control"
                  id="gender"
                  v-model="data.item.gender"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="nation">Quốc Tịch</label>
                <input
                  type="text"
                  class="form-control"
                  id="nation"
                  v-model="data.item.nation"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="ethnic">Dân Tộc</label>
                <input
                  type="text"
                  class="form-control"
                  id="ethnic"
                  v-model="data.item.ethnic"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="phone">SĐT</label>
                <input
                  type="text"
                  class="form-control"
                  id="phone"
                  v-model="data.item.phone"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  v-model="data.item.email"
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="address">Địa Chỉ</label>
            <textarea
              type="text"
              class="form-control"
              id="address"
              v-model="data.item.address"
            />
          </div>

          <div class="border-hr"></div>

          <div class="row mt-3">
            <div class="col-md-6">
              <button
                type="button"
                class="btn btn-primary mr-3"
                @click="update"
              >
                Lưu Thay Đổi
              </button>
              <!-- <button type="button" class="btn btn-secondary">Thiết Lập Lại</button> -->
            </div>
            <div class="col-md-6" style="float: right !important;">
              <button
              type="button"
              class="btn btn-outline-dark rounded-circle"
              style="font-size: 14px; width: 50px; height: 40px"
              @click="toggleVoiceRecognition"
              id="toggleVoiceButton"
            >
              <span v-if="isListening" class="material-symbols-outlined"
                >mic_off</span
              >
              <span v-else class="material-symbols-outlined">mic</span>
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import User from "../../services/user.service";
import { reactive, onBeforeMount } from "vue";
import { http_getOne, http_update } from "../../assets/js/common.http";
import { alert_error, alert_success } from "../../assets/js/common.alert";
import { ref } from "vue";
export default {
  components: {},
  setup() {
    const data = reactive({
      item: {},
      activeMenu: 1,
    });
    const update = async () => {
      try {
        const updatedData = await http_update(User, data.item._id, data.item); // Gửi dữ liệu cập nhật lên máy chủ thông qua hàm http_update.
        // Xử lý dữ liệu cập nhật nếu cần.
        alert_success(
          "Cập Nhật Thông Tin",
          "Thông tin cá nhân đã được cập nhật thành công"
        );
      } catch (error) {
        alert_error(`Lỗi Cập Nhật Thông Tin`, error);
      }
    };
    const refresh = async () => {
      const id = sessionStorage.getItem("UserId");
      data.item = await http_getOne(User, id);
      console.log(data.item._id);
    };
    onBeforeMount(async () => {
      refresh();
    });
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "vi";
    let isListening = ref(false);
    let shouldRestartRecognition = true;

    recognition.onstart = () => {
      isListening.value = true;
    };

    recognition.onend = () => {
      isListening.value = false;
      if (shouldRestartRecognition) {
        recognition.start();
      }
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Lỗi nhận dạng giọng nói:", event.error);
    };
    const toggleVoiceRecognition = () => {
      if (isListening.value) {
        stopRecognition();
      } else {
        recognition.start();
        isListening.value = true;
        shouldRestartRecognition = true;
      }
    };

    const stopRecognition = () => {
      recognition.stop();
      shouldRestartRecognition = false;
    };
    const handleVoiceCommand = (command) => {
      const keywords = [
        "họ tên",
        "căn cước",
        "bảo hiểm",
        "nghề nghiệp",
        "ngày sinh",
        "giới tính",
        "quốc tịch",
        "dân tộc",
        "số điện thoại",
        "email",
        "địa chỉ"
      ];

      for (const keyword of keywords) {
        if (command.includes(keyword)) {
          const value = command.replace(keyword, "").trim();
          console.log("Keyword:", keyword, "Value:", value);
          switch (keyword) {
            case "ngày sinh":
              // Extract day, month, and year using regex
              const match = value.match(
                /ngày (\d{1,2}) tháng (\d{1,2}) năm (\d{4})/
              );
              if (match) {
                const day = match[1].padStart(2, "0");
                const month = match[2].padStart(2, "0");
                const year = match[3];
                const formattedDate = `${year}-${month}-${day}`;
                data.item.birthday = formattedDate;
              } else {
                console.error("Invalid date format:", value);
              }
              break;
            case "họ tên":
              data.item.name = value;
              break;
            case "căn cước":
              data.item.passport = value;
              break;
            case "bảo hiểm":
              data.item.insurance = value;
              break;
            case "nghề nghiệp":
              data.item.digital_identity = value;
              break;
            case "quốc tịch":
              data.item.nation = value;
              break;
            case "dân tộc":
              data.item.ethnic = value;
              break;
            case "số điện thoại":
              data.item.phone = value;
              break;
            case "email":
              data.item.email = value;
              break;
            case "địa chỉ":
              data.item.address = value;
              break;
            case "giới tính":
              data.item.gender = value
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              break;
          }
        }
      }
    };
    const activeMenu = ref(1);
    return {
      data,
      update,
      activeMenu,
      isListening,
      toggleVoiceRecognition,
      handleVoiceCommand,
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
