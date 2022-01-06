<template>
  <div class="text-xl font-sans">
    <input
      type="text"
      name="date_time_input"
      @click="calendar.open = true"
      placeholder="Date"
    />
    {{ calendar.selectedDate }}
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        id="calendar"
        class="border calendar"
        v-if="calendar.open"
        v-click-outside="closeCalendar"
      >
        <div class="flex content-center flex-col">
          <div class="flex flex-row justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              @click="previousMonth()"
            >
              <path
                fill-rule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="month">{{ monthName() }}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              @click="nextMonth()"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="week" v-for="i in 5" :key="i">
            <div
              @mouseover="setHoveredDate(i, j)"
              class="day hover:ring hover:ring-indigo-300"
              :class="{
                'bg-gray-300': datesMatch(
                  calculateDate(i, j),
                  calendar.selectedDate
                ),
                'bg-gray-200': dateInRange(calculateDate(i, j)),
              }"
              v-for="j in 7"
              :key="j"
              @click="calendar.selectedDate = calculateDate(i, j)"
            >
              {{ calculateDate(i, j).toFormat("dd") }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { PropType, defineProps, reactive } from "vue";
import { DateTime } from "luxon";

const props = defineProps({
  minDate: Object as PropType<Date>,
  maxDate: Object as PropType<Date>,
  startDate: Object as PropType<Date>,
});

const calendar = reactive({
  open: false,
  selectedDate: props.startDate
    ? DateTime.fromJSDate(props.startDate).startOf("day")
    : new DateTime(),
  startDate: props.startDate
    ? DateTime.fromJSDate(props.startDate).startOf("day")
    : new DateTime(),
  hoveredDate: props.startDate
    ? DateTime.fromJSDate(props.startDate).startOf("day")
    : new DateTime(),
});

const setHoveredDate = (week: number, day: number): void => {
  calendar.hoveredDate = calculateDate(week, day);
};

const dateInRange = (day: DateTime): boolean => {
  const hoveredDate = calendar.hoveredDate.toMillis();
  const selectedDate = calendar.selectedDate.toMillis();
  return (
    (hoveredDate > day.toMillis() && selectedDate < day.toMillis()) ||
    (hoveredDate < day.toMillis() && selectedDate > day.toMillis())
  );
};

const datesMatch = (date1: DateTime, date2: DateTime): boolean => {
  return date1.startOf("day").equals(date2.startOf("day"));
};

const monthName = (): string => {
  return calendar.startDate.plus({ days: 7 }).toFormat("LLLL yyyy");
};

const closeCalendar = (): void => {
  calendar.open = false;
};

const calculateDate = (week: number, day: number): DateTime => {
  const startOfMonth = calendar.startDate.startOf("month");
  const delta = (week - 1) * 7 + day - 1;
  return startOfMonth.plus({ days: delta });
};

const previousMonth = (): void => {
  calendar.startDate = calendar.startDate.minus({ months: 1 });
};

const nextMonth = (): void => {
  calendar.startDate = calendar.startDate.plus({ months: 1 });
};
</script>

<style scoped>
.calendar {
  @apply p-2 m-2 max-w-sm;
}

.calendar .month {
  @apply flex justify-center mb-2;
}

.calendar .week {
  @apply flex justify-between text-base;
}

.calendar .week .day {
  @apply w-24 flex justify-center;
}
</style>
