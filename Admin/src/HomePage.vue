<script>
import Navbar from "./components/layout/navbar.vue";
import Footer from "./components/layout/footer.vue";
import Sidebar from "./components/layout/sidebar.vue";
import { reactive } from "vue";
export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const data = reactive({
      activeMenuResponsive: false,
      activeIndex: sessionStorage.getItem("activeMenu") || 1,
    });
    const updateMenuResponsive = () => {
      console.log("Received event from child component:");
    };
    return {
      data,
      updateMenuResponsive,
    };
  },
};
</script>

<template>
  <nav class="navbar">
    <!-- Navbar content goes here -->
    <Navbar />
  </nav>
  <div class="sidebar">
    <!-- Sidebar content goes here -->
    <Sidebar :activeIndex="data.activeIndex" />
  </div>
  <div class="content">
    <!-- Content goes here -->
    <router-view></router-view>
  </div>
  <div class="footer">
    <!-- Footer goes here -->
    <Footer />
  </div>
</template>

<style scoped></style>
