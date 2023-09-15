import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/admin",
    alias: "/login",
    name: "Login",
    component: () => import("../../src/Login.vue"),
  },
  {
    path: "/",
    component: () => import("../../src/HomePage.vue"),
    meta: { requiresAuth: true }, // Bạn có thể sử dụng meta để đánh dấu các trang yêu cầu xác thực
    children: [
      {
        path: "/",
        name: "Dashboard",
        component: () => import('../views/dashboard/index.vue'),
      },
      {
        path: "/family",
        name: "Family",
        component: () => import('../views/family/index.vue'),
      },
      {
        path: "/familytype",
        name: "FamilyTypes",
        component: () => import('../views/family/family.vue'),
      },
      {
        path: "/health_record",
        name: "HealthRecords",
        component: () => import('../views/health_records/index.vue'),
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem("token"); // Kiểm tra xem người dùng đã đăng nhập hay chưa
  // console.log(`isAuthenticated `, isAuthenticated);
  // const customerId = sessionStorage.getItem("customerId");
  // const customerName = sessionStorage.getItem("customerName");
  // const role = sessionStorage.getItem("role");
  // console.log(customerId, customerName, role);
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // Nếu trang yêu cầu xác thực và người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    next({ name: "Login" });
  } else {
    next();
  }
});
export default router;
