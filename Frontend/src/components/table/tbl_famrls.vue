<script>
import { reactive } from "vue";
export default {
  props: {
    items: {
      type: Array,
      default: [],
    },
    fields: {
      type: Array,
      default: ["Name", "Age", "Payment"],
    },
    labels: {
      type: Array,
      default: [],
    },
    actionList: {
      type: Array,
      default: [],
    },
    activeAction: {
      type: Boolean,
      default: true,
    },
    borderTableAll: {
      type: Boolean,
      default: false,
    },
    showActionList: {
      type: Array,
      default: [true, true, true],
    },
  },
  setup(props, ntx) {},
};
</script>

<template>
  <table
    class="my-table mb-2"
    :class="[borderTableAll ? 'border-table-all' : '']"
  >
    <thead>
      <tr>
        <!-- <th></th> -->
        <th>STT</th>
        <th v-for="(value, index) in fields">{{ value }}</th>
        <th v-if="activeAction == true">Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items">
        <!-- <td><input type="checkbox" name="" id="" /></td> -->
        <td>{{ index + 1 }}</td>
        <td v-for="(label, index1) in labels">{{ item[label] }}</td>
        <td v-if="activeAction == true">
          <button
            v-if="showActionList[0] == true"
            type="button"
            class="format-btn"
            data-toggle="modal"
            data-target="#model-view"
          >
            <span
              id="view"
              class="material-symbols-outlined d-flex align-items-center"
            >
              visibility
            </span>
          </button>
          <button
            v-if="showActionList[1] == true"
            type="button"
            class="mx-2 format-btn"
            data-toggle="modal"
            data-target="#model-edit"
          >
            <span
              id="edit"
              class="material-symbols-outlined d-flex align-items-center justify-content-center"
              @click="$emit('edit', item, true)"
            >
              edit
            </span>
          </button>
          <span
            v-if="showActionList[2] == true"
            id="delete"
            class="material-symbols-outlined"
            @click="$emit('delete', item._id, item)"
          >
            delete
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="items.length == 0" class="text-center mt-2">
    Không tồn tại bản ghi.
  </p>
</template>

<style scoped>
.my-table {
  width: 100%;
  border-collapse: collapse;
}

.border-table-all {
  border: 1px solid var(--gray);
}

.my-table th,
.my-table td {
  border: 1px solid var(--gray);
  border-left: 0;
  border-right: 0;
  padding: 8px;
}
.my-table td {
  font-size: 15px; /* Adjust the font size as needed */
}


.my-table th {
  font-weight: 900;
  font-size: 14px;
}

.my-table tbody tr:nth-child(even) {
  font-size: 13px;
}

#view,
#edit,
#delete {
  font-size: 18px;
  cursor: pointer;
  border: 1px solid var(--gray);
  border-radius: 4px;
  padding: 1px;
}
#view:hover {
  color: var(--blue);
}
#edit:hover {
  color: var(--yellow);
}
#delete:hover {
  color: var(--red);
}
</style>
