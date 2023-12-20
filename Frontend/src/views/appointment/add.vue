<script>
import { reactive } from "vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { http_create } from '../../assets/js/common.http';
import Appointment from "../../services/appointment.service";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({});
    const create = () => {
      ctx.emit("create");
      console.log("Thêm Thành Công");
    };
    const item = ref(props.item);
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
    const handleVoiceCommand = async(command) => {
      const keywords = [
        "cuộc hẹn",
        "ngày bắt đầu",
        "địa điểm",
        "trạng thái",
        "ghi chú",
        "thêm mới"
      ];

      for (const keyword of keywords) {
        if (command.includes(keyword)) {
          const value = command.replace(keyword, "").trim();
          console.log("Keyword:", keyword, "Value:", value);
          switch (keyword) {
            case "cuộc hẹn":
              const lowercasedValue = value.toLowerCase();
              const appointmentTypes = [
                "Khám Bệnh",
                "Tiêm Ngừa Covid 19",
                "Tiêm Ngừa Uốn Ván",
                "Tiêm Ngừa Viêm Gan",
                "Tiêm Ngừa Bệnh Truyền Nhiễm",
                "Tiêm Ngừa Nhiễm Khuẩn",
              ];
              const lowercasedAppointmentTypes = appointmentTypes.map((type) =>
                type.toLowerCase()
              );

              if (lowercasedAppointmentTypes.includes(lowercasedValue)) {
                item.value.appointment_type = value
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
              } else {
                console.error("Invalid appointment type:", value);
              }

              break;
            case "ngày bắt đầu":
              // Extract day, month, and year using regex
              const match = value.match(
                /ngày (\d{1,2}) tháng (\d{1,2}) năm (\d{4})/
              );
              if (match) {
                const day = match[1].padStart(2, "0");
                const month = match[2].padStart(2, "0");
                const year = match[3];
                const formattedDate = `${year}-${month}-${day}`;
                item.value.start_date = formattedDate;
              } else {
                console.error("Invalid date format:", value);
              }
              break;
            case "địa điểm":
              item.value.place = value;
              break;
            case "trạng thái":
              item.value.status = value;
              break;
            case "ghi chú":
              item.value.note = value;
              break;
            case "thêm mới":
              // const add = await http_create(Appointment, item);
              // console.log("add", add);
              create();
          }
        }
      }
    };

    return {
      create,
      isListening,
      toggleVoiceRecognition,
      handleVoiceCommand,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addapp">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">Thêm Lịch Hẹn</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="appointment_type">Loại Cuộc Hẹn:</label>
              <select
                class="form-control"
                id="appointment_type"
                name="appointment_type"
                v-model="item.appointment_type"
                required
              >
                <option value="Khám Bệnh">Khám Bệnh</option>
                <option value="Tiêm Ngừa Covid 19">Tiêm Ngừa Covid 19</option>
                <option value="Tiêm Ngừa Uốn Ván">Tiêm Ngừa Uốn Ván</option>
                <option value="Tiêm Ngừa Viêm Gan">Tiêm Ngừa Viêm Gan</option>
                <option value="Tiêm Ngừa Bệnh Truyền Nhiễm">
                  Tiêm Ngừa Bệnh Truyền Nhiễm
                </option>
                <option value="Tiêm Ngừa Nhiễm Khuẩn">
                  Tiêm Ngừa Nhiễm Khuẩn
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="start_date"
                >Ngày Bắt Đầu(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="start_date"
                name="start_date"
                v-model="item.start_date"
                required
              />
            </div>
            <div class="form-group">
              <label for="place"
                >Địa Điểm(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="place"
                name="place"
                v-model="item.place"
                required
              />
            </div>
            <div class="form-group">
              <label for="status"
                >Trạng Thái(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="status"
                name="status"
                v-model="item.status"
                required
              />
            </div>
            <div class="form-group">
              <label for="note">Ghi Chú:</label>
              <input
                type="text"
                class="form-control"
                id="note"
                name="note"
                v-model="item.note"
              />
            </div>
            <!-- Thêm nút nhận dạng giọng nói -->
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

            <!-- <button type="button" class="btn btn-outline-secondary px-3 py-2">
              <span class="material-symbols-outlined"> mic </span>
            </button> -->
            <button
              type="button"
              class="btn btn-primary px-3 py-2"
              style="font-size: 14px"
              @click="create"
              id="add"
            >
              <span>Thêm</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#add {
  float: right;
}
/* CSS để bố trí radio button và label ngang hàng */
.gender-options {
  display: flex;
  align-items: center;
}

.gender-options input[type="radio"] {
  margin-right: 1px; /* Khoảng cách giữa radio button và label */
  width: 50px;
  height: 20px;
}

.gender-options label {
  margin-right: 50px; /* Khoảng cách giữa các label */
  display: flex;
  align-items: center;
}
</style>
