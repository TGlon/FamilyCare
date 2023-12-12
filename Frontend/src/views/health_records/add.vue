<script>
import { reactive, ref } from "vue";
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
    const handleVoiceCommand = (command) => {
      const keywords = [
        "ngày ghi nhận",
        "cân nặng",
        "chiều cao",
        "nhóm máu",
        "nhịp tim",
        "huyết áp"
      ];

      for (const keyword of keywords) {
        if (command.includes(keyword)) {
          const value = command.replace(keyword, "").trim();
          console.log("Keyword:", keyword, "Value:", value);
          switch (keyword) {
            case "ngày ghi nhận":
              // Extract day, month, and year using regex
              const match = value.match(
                /ngày (\d{1,2}) tháng (\d{1,2}) năm (\d{4})/
              );
              if (match) {
                const day = match[1].padStart(2, "0");
                const month = match[2].padStart(2, "0");
                const year = match[3];
                const formattedDate = `${year}-${month}-${day}`;
                item.value.recording_date = formattedDate;
              } else {
                console.error("Invalid date format:", value);
              }
              break;
            case "cân nặng":
              item.value.weight = value;
              break;
            case "chiều cao":
              item.value.height = value;
              break;
            case "nhóm máu":
              item.value.blood_type = value;
              break;
            case "nhịp tim":
              item.value.heart_rate = value;
              break;
            case "huyết áp":
              item.value.blood_pressure = value;
              break;
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
  <div class="modal" id="modal-addhealth">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Tạo Hồ Sơ Sức Khỏe
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="recording_date"
                >Ngày Ghi Nhận<span style="color: red">*</span>:</label
              >
              <input
                type="date"
                class="form-control"
                id="recording_date"
                name="recording_date"
                v-model="item.recording_date"
                required
              />
            </div>
            <div class="form-group">
              <label for="weight"
                >Cân Nặng(Kg)<span style="color: red">*</span>:</label
              >
              <input
                type="text"
                class="form-control"
                id="weight"
                name="weight"
                v-model="item.weight"
                required
              />
            </div>
            <div class="form-group">
              <label for="height"
                >Chiều Cao(Cm)<span style="color: red">*</span>:</label
              >
              <input
                type="text"
                class="form-control"
                id="height"
                name="height"
                v-model="item.height"
                required
              />
            </div>
            <div class="form-group">
              <label for="blood_type"
                >Nhóm Máu<span style="color: red">*</span>:</label
              >
              <input
                type="text"
                class="form-control"
                id="blood_type"
                name="blood_type"
                v-model="item.blood_type"
                required
              />
            </div>
            <div class="form-group">
              <label for="heart_rate"
                >Nhịp Tim(Lần/phút)<span style="color: red">*</span>:</label
              >
              <input
                type="text"
                class="form-control"
                id="heart_rate"
                name="heart_rate"
                v-model="item.heart_rate"
                required
              />
            </div>
            <div class="form-group">
              <label for="blood_pressure"
                >Huyết Áp(mmHg)<span style="color: red">*</span>:</label
              >
              <input
                type="text"
                class="form-control"
                id="blood_pressure"
                name="blood_pressure"
                v-model="item.blood_pressure"
                required
              />
            </div>
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
