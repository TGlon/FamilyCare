<template>
  <div class="container-fluid">
    <div
      class="row justify-content-center align-items-center"
      style="
        background-image: url(https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      "
    >
      <div class="d-flex">
        <div class="card shadow bg-bray" style="background: #20262e">
          <div class="card-body p-4">
            <h3
              class="card-title text-center"
              style="color: aliceblue; font-weight: bold; margin-bottom: 20px"
            >
              Đăng Ký Tài Khoản
            </h3>
            <form @submit.prevent="register">
              <div class="mb-3 row">
                <label
                  for="name"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Họ và Tên(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="name"
                    type="text"
                    class="form-control"
                    id="name"
                    required
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="username"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Tên Tài Khoản(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="username"
                    type="text"
                    class="form-control"
                    id="username"
                    required
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="password"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Mật Khẩu(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
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
              </div>
              <div class="mb-1 row">
                <label
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Giới Tính(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="male"
                      value="Nam"
                      v-model="gender"
                      required
                    />
                    <label
                      class="form-check-label"
                      style="color: white"
                      for="male"
                      >Nam</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="female"
                      value="Nữ"
                      v-model="gender"
                      required
                    />
                    <label
                      class="form-check-label"
                      style="color: white"
                      for="female"
                      >Nữ</label
                    >
                  </div>
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="birthday"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Ngày Sinh(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="birthday"
                    type="date"
                    class="form-control"
                    id="birthday"
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="address"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Địa Chỉ(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="address"
                    type="text"
                    class="form-control"
                    id="address"
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="insurance"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Bảo Hiểm(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="insurance"
                    type="text"
                    class="form-control"
                    id="insurance"
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="passport"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  CCCD/CMND(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="passport"
                    type="text"
                    class="form-control"
                    id="passport"
                  />
                </div>
              </div>
              <div class="mb-3 row">
                <label
                  for="digital_identity"
                  class="col-form-label col-4"
                  style="font-weight: bold; color: white"
                >
                  Mã Định Danh(<span style="color: red">*</span>):
                </label>
                <div class="col-8">
                  <input
                    v-model="digital_identity"
                    type="text"
                    class="form-control"
                    id="digital_identity"
                  />
                </div>
              </div>
              <div class="mb-2 row">
                <label
                  for="email"
                  class="col-form-label col-3"
                  style="font-weight: bold; color: white"
                  >Email(<span style="color: red">*</span>):</label
                >
                <div class="col-3">
                  <input
                    v-model="email"
                    type="email"
                    class="form-control"
                    id="email"
                  />
                </div>
                <label
                  for="phone"
                  class="col-form-label col-3"
                  style="font-weight: bold; color: white"
                  >SĐT(<span style="color: red">*</span>):</label
                >
                <div class="col-3">
                  <input
                    v-model="phone"
                    type="tel"
                    class="form-control"
                    id="phone"
                  />
                </div>
              </div>

              <div class="mb-2 row mt-3">
                <div class="col-3">
                  <label
                    for="nation"
                    class="col-form-label mr-1"
                    style="font-weight: bold; color: white"
                    >Quốc Tịch(<span style="color: red">*</span>):</label
                  >
                </div>
                <div class="col-3">
                  <input
                    v-model="nation"
                    type="text"
                    class="form-control ml-0"
                    id="nation"
                  />
                </div>
                <div class="col-3">
                  <label
                    for="ethnic"
                    class="col-form-label mr-0"
                    style="font-weight: bold; color: white"
                    >Dân Tộc(<span style="color: red">*</span>):</label
                  >
                </div>
                <div class="col-3">
                  <input
                    v-model="ethnic"
                    type="text"
                    class="form-control ml-0"
                    id="ethnic"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                style="font-weight: bold; margin-top: 20px"
              >
                Đăng Ký
              </button>
              <p style="color: aliceblue; font-weight: bold; margin-top: 15px">
                Đã có tài khoản?
                <router-link to="/login" style="color: #7091f5"
                  >Đăng Nhập</router-link
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
import { http_create } from "../src/assets/js/common.http";
import User from "../src/services/user.service";
import Account from "../src/services/account.services";
export default {
  setup() {
    const showPassword = ref(false);
    const name = ref("");
    const username = ref("");
    const gender = ref("");
    const birthday = ref("");
    const insurance = ref("");
    const passport = ref("");
    const digital_identity = ref("");
    const email = ref("");
    const phone = ref("");
    const nation = ref("");
    const ethnic = ref("");
    const password = ref("");
    const selectedGenders = ref([]);
    const router = useRouter();
    const address = ref("");
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const register = async () => {
  const userData = {
    name: name.value,
    gender: gender.value,
    birthday: birthday.value,
    address: address.value,
    passport: passport.value,
    digital_identity: digital_identity.value,
    insurance: insurance.value,
    phone: phone.value,
    email: email.value,
    nation: nation.value,
    ethnic: ethnic.value,
  };

  try {
    const CreateUser = await http_create(User, userData);

    const accountData = {
      username: username.value,
      password: password.value,
      roleId: "c97ca6dd-cc7d-4466-8380-d45ab7f3693a",
      UserId: CreateUser.document._id,
    };

    const CreateAccount = await http_create(Account, accountData);

    // Nếu tạo tài khoản thành công, hiển thị thông báo thành công
    if (CreateAccount) {
      alert_success("Tạo tài khoản thành công", CreateAccount.msg);
      router.push({ name: "Login" });
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi tạo tài khoản:", error);
    // Hiển thị thông báo lỗi nếu bạn muốn
    alert_error("Đã xảy ra lỗi khi tạo tài khoản", CreateAccount.msg);
  }
};


    return {
      name,
      username,
      gender,
      birthday,
      insurance,
      passport,
      digital_identity,
      email,
      phone,
      nation,
      ethnic,
      password,
      togglePasswordVisibility,
      showPassword,
      register,
      selectedGenders,
      address
    };
  },
};
</script>
<style scoped>
.container-fluid {
  background-color: #f8f9fa;
  overflow-y: hidden;
}

.card {
  border: none;
  border-radius: 10px;
  width: 750px;
  height: 100%; /* Make it fill the available vertical space */
  max-height: 100vh; /* Increase the height to accommodate additional fields */
  opacity: 0.92;
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
