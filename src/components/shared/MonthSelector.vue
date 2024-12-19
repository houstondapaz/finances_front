<template>
  <div class="monthpicker">
    <div class="monthpicker-header">
      <QBtn @click="previousMonth" dense flat icon="navigate_before" round />
      {{ selectedMonth.format("MM/YYYY") }}
      <QBtn @click="nextMonth" dense flat icon="navigate_next" round />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Dayjs } from "dayjs";
import { computed } from "vue";
const emit = defineEmits<{ (e: "change"): void }>();
const model = defineModel<Dayjs>({ required: true });

const selectedMonth = computed(() => model.value);

function nextMonth() {
  selectMonth(selectedMonth.value.add(1, "month"));
}

function previousMonth() {
  selectMonth(selectedMonth.value.subtract(1, "month"));
}
function selectMonth(month: Dayjs) {
  model.value = month;
  emit("change");
}
</script>

<style>
.monthpicker {
  width: 125px;
}

.monthpicker-current {
  font-weight: bold;
}

.monthpicker-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.monthpicker-months {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.monthpicker-months .QBtn {
  box-shadow: none;
  margin: 4px 0;
  width: 30%;
}
</style>
