<script>
import { reactive } from "vue";
import Family from "../../services/family.service";
import User_Family from "../../services/user_family.service";
import {
  http_getAllByFamilyId,
  http_getAllByUserId,
} from "../../assets/js/common.http";
import { onMounted, onBeforeMount } from "vue";
export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
    mqh: {
      type: Object,
      default: {},
    },
    fam: {
      type: Object,
      default: {}
    }
  },
  setup(props, ctx) {
    const data = reactive({
      items: [],
      UsrIdFam: [],
    });
    const create = () => {
      ctx.emit("create1");
      console.log("Thêm Thành Công");
    };
    const refresh = async () => {
      const loggedInUserId = sessionStorage.getItem("UserId");
      data.UsrIdFam = await http_getAllByUserId(User_Family, loggedInUserId);
      if (data.UsrIdFam.length === 0) {
        console.log("UserId không thuộc vào bất kỳ gia đình nào");
      } else {
        const familyIds = data.UsrIdFam.map(
          (userFamily) => userFamily.FamilyId
        );
        data.items = []; 
        for (const familyId of familyIds) {
          const familyData = await http_getAllByFamilyId(Family, familyId);
          data.items.push(...familyData); // Thêm gia đình vào mảng items
          // console.log("Danh sách gia đình:", data.items);
        }
      }
    };
    onBeforeMount(async () => {
      refresh();
    });
    return {
      create,
      data,
    };
  },
};
</script>

<template>
  <!-- The Modal -->
  <div class="modal" id="modal-addaccmem">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title" style="font-size: 15px">
            Tạo TK Thành Viên Mới Và Thêm Mối Quan Hệ
          </h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <form action="" class="was-validated">
            <div class="form-group">
              <label for="name"
                >Tên Thành Viên(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                v-model="item.name"
                required
              />
            </div>
            <div class="form-group">
              <label for="family">Chọn Hộ Gia Đình(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="family"
                name="family"
                v-model="fam.family"
                required
              >
                <option
                  v-for="family in data.items"
                  :key="family._id"
                  :value="family._id"
                >
                  {{ family.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="relationship"
                >Mối Quan Hệ(<span style="color: red">*</span>):</label
              >
              <select
                class="form-control"
                id="relationship"
                name="relationship"
                v-model="mqh.relationship"
                required
              >
                <option value="Chủ Hộ" selected>Chủ Hộ</option>
                <option value="Vợ">Vợ</option>
                <option value="Chồng">Chồng</option>
                <option value="Con">Con</option>
                <option value="Bố">Bố</option>
                <option value="Mẹ">Mẹ</option>
                <option value="Anh">Anh</option>
                <option value="Chị">Chị</option>
                <option value="Em">Em</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div class="form-group">
              <label for="insurance"
                >Mã Y Tế(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="insurance"
                name="insurance"
                v-model="item.insurance"
                required
              />
            </div>
            <div class="form-group">
              <label for="birthday"
                >Ngày Sinh(<span style="color: red">*</span>):</label
              >
              <input
                type="date"
                class="form-control"
                id="birthday"
                name="birthday"
                v-model="item.birthday"
                required
              />
            </div>
            <div class="form-group">
              <label for="address"
                >Địa Chỉ(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="address"
                name="address"
                v-model="item.address"
                required
              />
            </div>
            <div class="form-group">
              <label for="passport"
                >CCCD/CMND(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="passport"
                name="passport"
                v-model="item.passport"
                required
              />
            </div>
            <div class="form-group">
              <label for="gender"
                >Giới Tính(<span style="color: red">*</span>):</label
              >
              <div class="gender-options">
                <input
                  type="radio"
                  class="form-control"
                  id="gender-nam"
                  name="gender"
                  value="Nam"
                  v-model="item.gender"
                  required
                />
                <label for="gender-nam">Nam</label>

                <input
                  type="radio"
                  class="form-control"
                  id="gender-nu"
                  name="gender"
                  value="Nữ"
                  v-model="item.gender"
                  required
                />
                <label for="gender-nu">Nữ</label>

                <input
                  type="radio"
                  class="form-control"
                  id="gender-khac"
                  name="gender"
                  value="Khác"
                  v-model="item.gender"
                  required
                />
                <label for="gender-khac">Khác</label>
              </div>
            </div>
            <div class="form-group">
              <label for="phone"
                >Số Điện Thoại(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="phone"
                name="phone"
                v-model="item.phone"
                required
              />
            </div>

            <div class="form-group">
              <label for="digital_identity"
                >Nghề Nghiệp(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="digital_identity"
                name="digital_identity"
                v-model="item.digital_identity"
                required
              />
            </div>
            <div class="form-group">
              <label for="email"
                >Email(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                v-model="item.email"
                required
              />
            </div>
            <div class="form-group">
              <label for="nation"
                >Quốc Tịch(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="nation"
                name="nation"
                v-model="item.nation"
                required
              />
            </div>
            <div class="form-group">
              <label for="ethnic"
                >Dân Tộc(<span style="color: red">*</span>):</label
              >
              <input
                type="text"
                class="form-control"
                id="ethnic"
                name="ethnic"
                v-model="item.ethnic"
                required
              />
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
