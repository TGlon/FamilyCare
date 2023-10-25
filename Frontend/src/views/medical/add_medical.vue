<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const item = ref(props.item);
    const recognition = new webkitSpeechRecognition();

    recognition.lang = "vi";
    let isListening = ref(false);
    let shouldRestartRecognition = true; // Biến để kiểm tra khởi động lại giọng nói

    recognition.onstart = () => {
      isListening.value = true;
    };

    recognition.onend = () => {
      isListening.value = false;
      // Kiểm tra xem có nên khởi động lại nhận dạng giọng nói
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

    const create = () => {
      ctx.emit("create1");
      console.log("Thêm Thành Công");
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
      const keywords = ["chuẩn đoán", "tình trạng sức khỏe", "bác", "ghi chú"];
      for (const keyword of keywords) {
        if (command.includes(keyword)) {
          const value = command.replace(keyword, "").trim();
          switch (keyword) {
            case "chuẩn đoán":
              item.value.diagnosis = value;
              break;
            case "tình trạng sức khỏe":
              item.value.medical_condition = value;
              break;
            case "bác":
              item.value.doctor = value;
              break;
            case "ghi chú":
              item.value.note = value;
              break;
          }
        }
      }
    };

    return {
      item,
      create,
      isListening,
      toggleVoiceRecognition,
    };
  },
};
</script>




<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addmedicalhistory">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Tạo Lịch Sử Khám Bệnh
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="diagnosis"
                >Chuẩn Đoán(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="diagnosis"
                name="diagnosis"
                v-model="item.diagnosis"
                required
              />
            </div>
            <div class="form-group">
              <label for="medical_condition"
                >Tình Trạng Sức Khỏe(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="medical_condition"
                name="medical_condition"
                v-model="item.medical_condition"
                required
              />
            </div>
            <div class="form-group">
              <label for="doctor"
                >Bác Sĩ Chuẩn Đoán(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="doctor"
                name="doctor"
                v-model="item.doctor"
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
            <button
              type="button"
              class="btn btn-secondary  rounded-circle"
              style="font-size: 14px;width: 50px; height: 40px;"
              @click="toggleVoiceRecognition"
              id="toggleVoiceButton"
            >
              <span
                v-if="isListening"
                class="material-symbols-outlined"
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
