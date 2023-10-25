<template>
  <div class="container-fluid">
    <div
      class="row justify-content-center align-items-center vh-100"
      style="
        background-image: url(https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      "
    >
      <div class="d-flex">
        <div class="card shadow bg-bray" style="background: #20262e">
          <div class="card-body p-5">
            <h5 class="card-title text-center mb-4">
              <img
                src="./assets/images/logo-login1.png"
                alt=""
                style="width: 230px; height: 200px; margin-bottom: 30px"
              />
            </h5>
            <!-- <h3
              class="text-center mb-4"
              style="font-weight: bold; color: white"
            >
              ĐĂNG NHẬP
            </h3> -->
            <form @submit.prevent="login">
              <div class="mb-3">
                <label
                  for="text"
                  class="form-label"
                  style="font-weight: bold; color: white; margin-bottom: 15px"
                >
                  Tên Tài Khoản(<span style="color: red">*</span>):
                </label>
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  id="username"
                  required
                />
              </div>
              <div class="mb-3">
                <label
                  for="password"
                  class="form-label"
                  style="
                    font-weight: bold;
                    color: white;
                    margin-bottom: 15px;
                    margin-top: 10px;
                  "
                >
                  Mật Khẩu(<span style="color: red">*</span>):
                </label>
                <div class="input-group">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    id="password"
                    required
                  />
                  <div class="input-group-append">
                    <span class="input-group-text">
                      <i
                        class="fa"
                        :class="{
                          'fa-eye': showPassword,
                          'fa-eye-slash': !showPassword,
                        }"
                        @click="togglePasswordVisibility"
                        style="cursor: pointer"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                style="font-weight: bold; margin-top: 20px"
              >
                Đăng Nhập
              </button>
              <p style="color: aliceblue; font-weight: bold; margin-top: 15px">
                Cần một tài khoản?
                <router-link to="/signup" style="color: #7091f5"
                  >Đăng Ký</router-link
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { alert_error, alert_success } from "./assets/js/common.alert";
export default {
  setup() {
    const showPassword = ref(false);
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };
    // Xử lý sự kiện đăng nhập
    const login = async () => {
      try {
        // Gửi yêu cầu POST tới backend để kiểm tra đăng nhập
        const response = await axios.post(
          "http://localhost:3000/api/accounts/login",
          {
            username: username.value,
            password: password.value,
          }
        );
        // console.log("response", response);
        sessionStorage.setItem("token", response.data.token);
        // Kiểm tra phản hồi từ backend
        if (response.data.error == false) {
          console.log(response.data.message);
          console.log(response);
          console.log("USERNAME:", username.value);
          console.log("PASSWORD:", password.value);

          // Đăng nhập thành công, chuyển hướng đến trang chủ
          // alert_success(`Login`, `Đăng nhập thành công`);
          // sessionStorage.setItem("loginInfo", {
          //   customerId: response.data.document.Employee._id,
          //   customerName: response.data.document.Employee.name,
          //   role: response.data.document.Role.name,
          // });
          sessionStorage.setItem("UserId", response.data.document.User._id);
          sessionStorage.setItem("UserName", response.data.document.User.name);
          sessionStorage.setItem("role", response.data.document.Role.name);
          // router.push({ name: "Dashboard" });
          location.reload();
        } else {
          // Đăng nhập thất bại, xử lý thông báo lỗi hoặc hiển thị thông báo lỗi trên giao diện
          console.log(response.data.msg);
          alert_error(`Login`, `${response.data.msg}`);
          router.push({ name: "Login" });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const check = () => {
      const token = sessionStorage.getItem("token");
      const loginInfo = sessionStorage.getItem("loginInfo");
      // console.log(loginInfo);
      // console.log("token", token);
      if (token && token != "undefined") {
        router.push({ name: "Dashboard" });
      } else {
        router.push({ name: "Login" });
      }
    };

    check();

    return {
      username,
      password,
      login,
      togglePasswordVisibility,
      showPassword,
    };
  },
};
</script>

<style scoped>
.container-fluid {
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 10px;
  width: 550px;
  height: 600px;
  opacity: 0.95;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0069d9;
}

.vh-100 {
  height: 100vh;
}
</style>
