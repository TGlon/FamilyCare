<template>
    <div class="border-box d-flex flex-column ml-2">
      <!-- Menu -->
      <div class="d-flex menu my-3 mx-3 justify-content-end">
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 1"
          :class="[activeMenu == 1 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-17">Tổng Quan</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 2"
          :class="[activeMenu == 2 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Bệnh Tật</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 3"
          :class="[activeMenu == 3 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Tiêm Chủng</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 4"
          :class="[activeMenu == 4 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Dị Ứng</span>
        </router-link>
        <router-link
          :to="{ name: '' }"
          @click="activeMenu = 5"
          :class="[activeMenu == 5 ? 'active-menu' : 'none-active-menu']"
        >
          <span class="size-18">Bệnh Mãn Tính</span>
        </router-link>
      </div>
      <!-- Filter -->
       
      <!-- Search -->
      <div class="border-hr mb-3"></div>
      <div class="d-flex justify-content-between mx-3 mb-3">
        <div class="d-flex justify-content-start">
          <Select
            class="d-flex justify-content-start"
            :options="[
              {
                name: 5,
                value: 5,
              },
              {
                name: 10,
                value: 10,
              },
              {
                name: 20,
                value: 20,
              },
              {
                name: 30,
                value: 30,
              },
            ]"
            style="width: 125px"
            :title="`Số bản ghi`"
            
          />
          <Search
            class="ml-3"
            style="width: 300px"
            
            :options="[
              {
                _id: 'name',
                name: 'Tìm kiếm theo tên',
              },
            ]"
          />
        </div>
        <div class="d-flex align-items-start">
          <button
            type="button"
            class="btn btn-danger mr-3"
            data-toggle="modal"
            data-target="#model-delete-all"
            @click="deleteMany()"
          >
            <span id="delete-all" class="mx-2">Xoá</span>
          </button>
          <!-- <DeleteAll :items="data.items" /> -->
          <button
            type="button"
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#model-add"
          >
            <span id="add" class="mx-2">Thêm</span>
          </button>
          <button
            type="button"
            class="btn btn-secondary ml-3"
            data-toggle="modal"
            data-target="#model-setEvent"
            @click="setEvent()"
          >
            <span id="add" class="mx-2">Áp dụng</span>
          </button>
          
        </div>
      </div>
      <!-- Table -->
      <Table
        :items="setPages"
        :fields="[
          'Loại Dị Ứng',
          'Có',
          'Mức Độ',
          'Mô Tả',
        ]"
        :labels="['allergyType', 'HasAllergy', 'time_duration_format', 'totalCustomer']"
        
      />
      <!-- Pagination -->
      
    </div>

  </template>

<script>
import Table from "../../components/table/tbl_health.vue";
export default {
    components: {
        Table
    }
}
</script>

<style scoped>
.border-box {
  border: 1px solid var(--gray);
  border-radius: 5px;
}
.menu {
  /* border: 1px solid var(--gray); */
  border-collapse: collapse;
}
.menu a {
  border: 1px solid var(--gray);
  border-collapse: collapse;
  padding: 8px 12px;
  font-size: 15px;
}
.active-menu {
  color: blue;
}
.none-active-menu {
  color: var(--dark);
}
.border-hr {
  border-top: 1px solid var(--gray);
}
#add,
#delete-all {
  font-size: 14px;
}
.input {
  background-color: inherit;
  border: 1px solid var(--gray);
  border-radius: 5px;
}
</style>