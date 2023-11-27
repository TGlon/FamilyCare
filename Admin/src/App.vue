<script>
import Navbar from "./components/layout/navbar.vue";
import Footer from "./components/layout/footer.vue";
import Sidebar from "./components/layout/sidebar.vue";
import Login from "./login.vue";
// import { reactive, defineComponent } from "vue";
import { reactive, defineComponent, watchEffect, ref, computed } from "vue";
import { RouterView } from "vue-router";
import { onBeforeMount } from "vue";
// import { useRouter, useRoute } from "vue-router";
export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Login,
  },
  setup() {
    const data = reactive({
      activeMenuResponsive: false,
    });
    const checkLogin = ref(false);
    const updateMenuResponsive = () => {
      console.log("Received event from child component:");
    };

    onBeforeMount(() => {
      // const token = localStorage.getItem("token");
      // if(token){
      //   checkLogin.value = true
      // }else{
      //   checkLogin.value = false
      // }
    });
    return {
      data,
      updateMenuResponsive,
      checkLogin,
      // isRootPath
    };
  },
};
</script>

<template>
  <!-- <Login /> -->
  <!-- v-if="checkLogin" -->
  <!-- <div>
    <div class="container-fluid">
      <div class="row position-relative">
        <div
          class="z-index-3"
          :class="[
            data.activeMenuResponsive ? 'd-block' : 'col-xl-2 d-none d-xl-block',
          ]"
        >
          <Sidebar />
        </div>
        <div class="col-xl-10 col-sm-12 z-index-2">
          <Navbar @showMenu="data.activeMenuResponsive = true" />
          <RouterView></RouterView>
          <Footer />
        </div>
      </div>
    </div> -->
  <router-view></router-view>
</template>

<style scoped></style>
