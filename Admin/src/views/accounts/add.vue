<script>
import { onMounted, reactive } from "vue";
import Role from "../../services/role.service";
import { http_getAll } from "../../assets/js/common.http";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props, ctx) {
    const data = reactive({
      items: [],
    });
    const create = () => {
      ctx.emit("create");
      console.log("Thêm Thành Công");
    };
    onMounted(async () => {
      data.items = await http_getAll(Role);
    });
    return {
      create,data
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-account">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Tạo Người Dùng Và Tài Khoản Người Dùng
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="name">Họ Tên</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    v-model="item.name"
                    required
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
                    v-model="item.passport"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="username">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="item.username"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="item.password"
                    required
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
                    v-model="item.insurance"
                    required
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
                    v-model="item.digital_identity"
                    required
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
                    v-model="item.birthday"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="gender">Giới Tính</label>
                  <select
                    class="form-control"
                    id="gender"
                    v-model="item.gender"
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
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
                    v-model="item.phone"
                    required
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
                    v-model="item.email"
                    required
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
                    v-model="item.nation"
                    required
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
                    v-model="item.ethnic"
                    required
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
                v-model="item.address"
                required
              />
            </div>
            <div class="form-group">
              <label for="role">Vai Trò</label>
              <select
                class="form-control"
                id="role"
                v-model="item.role"
                required
              >
                <option
                  v-for="roleItem in data.items"
                  :key="roleItem._id"
                  :value="roleItem._id"
                >
                  {{ roleItem.name }}
                </option>
              </select>
            </div>

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
