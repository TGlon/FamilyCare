<script>
import {
  ref,
  onMounted,
  onUnmounted,
  defineProps,
  reactive,
  watch,
  onBeforeMount,
} from "vue";
export default {
  props: {
    options: {
      type: Array,
      required: true,
      default: [],
    },
    entryValue: {
      type: String,
      required: true,
      default: "",
    },
    title: {
      type: String,
    },
  },
  setup(props) {
    const data = reactive({
      a: 1,
      activeSelect: false,
      activeClose: false,
    });
    watch(
      () => props.entryValue,
      (newValue, oldValue) => {
        console.log("dang lang nghe");
        // for (let value of props.options) {
        //   console.log(value.name);
        //   console.log(props.entryValue);
        //   if (value.name == props.entryValue) {
        //     data.activeClose = true;
        //     break;
        //   }
        //   data.activeClose = false;
        // }
        console.log(data.activeClose);
        checkShowClose();
      }
    );
    const selectRef = ref(null);

    const handleClickOutside = (event) => {
      if (!selectRef.value.contains(event.target)) {
        data.activeSelect = false;
      }
    };

    const checkShowClose = () => {
      if (props.options.length > 0) {
        for (let value of props.options) {
          if (value.name == props.entryValue) {
            data.activeClose = true;
            break;
          }
          data.activeClose = false;
        }
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    onBeforeMount(() => {
      if (props.options != null) {
        checkShowClose();
      }
    });
    return {
      props,
      data,
      selectRef,
      checkShowClose,
    };
  },
};
</script>

<template>
  <div
    ref="selectRef"
    class="select-border d-flex align-items-center justify-content-between flex-row flex-row-reverse"
    style=""
  >
    <!-- title -->
    <div v-if="title != entryValue" class="select-title mx-auto">
      <span class="d-flex justify-content-center"
        ><span>{{ title }}</span></span
      >
    </div>
    <!-- content -->
    <div class="d-flex flex-row-reverse">
      <span
        class="material-symbols-outlined px-2 d-flex align-items-center"
        style="font-size: 20px; cursor: pointer"
        @click="data.activeSelect = !data.activeSelect"
      >
        {{ data.activeSelect == true ? "expand_less" : "expand_more" }}</span
      >
      <span
        v-if="data.activeClose == true"
        class="material-symbols-outlined d-flex align-items-center"
        style="font-size: 20px; cursor: pointer"
        @click="$emit('refresh')"
      >
        close</span
      >
    </div>
    <input
      type="text"
      class="px-2"
      :value="entryValue"
      style="font-size: 16px"
      @focus="data.activeSelect = true"
    />
    <!-- options -->
    <div
      v-if="data.activeSelect"
      class="select-content overflow-auto d-flex flex-column align-items-start justify-content-start"
    >
      <span
        v-for="(option, index) in options"
        :key="index"
        class="select-option py-1 px-2 d-flex align-items-center justify-content-between"
      >
        <span
          @click="
            [
              $emit('update:entryValue', option.value, option),
              (data.activeSelect = false),
              (entryValue = option.name),
            ]
          "
          class="mr-2"
          style="cursor: pointer; font-size: 15px"
          onmouseover="this.style.color='green';"
          onmouseout="this.style.color='';"
          >{{ option.name }}</span
        >
        <span
          v-if="option.name == entryValue"
          class="material-symbols-outlined d-flex align-items-center"
          style="cursor: pointer; font-size: 15px"
          >check</span
        >
      </span>
    </div>
  </div>
  <!-- <div class="">
    <select
      class="form-control d-flex justify-content-start"
      :value="entryValue"
      @input="$emit('update:entryValue', $event.target.value)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.name }}
      </option>
    </select>
  </div> -->
</template>

<style scoped>
.select-border {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid var(--gray);
  border-radius: 5px;
}

input {
  background-color: inherit;
  width: 100%;
  border: 0;
}
.select-title {
  position: absolute;
  top: -10px;
  left: 0;
  /* right: 0; */
}
.select-title span {
  position: relative;
  font-size: 12px;
}
.select-title span span {
  background-color: var(--light);
  padding: 0 5px;
}
.select-content {
  position: absolute;
  top: 0;
  width: 100%;
  border-radius: 5px;
  border: 1px solid var(--gray);
  border-radius: 5px;
  z-index: 10;
  margin-top: 50px;
  background-color: white;
}

.select-option {
  cursor: pointer;
  width: 100%;
}
</style>