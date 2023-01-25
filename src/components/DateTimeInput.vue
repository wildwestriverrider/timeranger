<template>
  <div class="text-xl font-sans fixed">
    <input
      type="text"
      name="date_time_input"
      @click="calendar.open = true"
      placeholder="Date"
      :value="calendar.selectedDate"
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
        class="border calendar relative"
        v-if="calendar.open"
        v-click-outside="closeCalendar"
      >
        <div class="flex items-center text-gray-900">
          <button type="button"
                  class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
            <span class="sr-only">Previous month</span>
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
          </button>
          <div class="flex-auto font-semibold">{{ monthName () }}</div>
          <button type="button"
                  class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
            <span class="sr-only">Next month</span>
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
          </button>
        </div>
        <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>
        <div class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
             v-for="i in 5">
          <button v-for="(j) in 7"
                  :key="j"
                  type="button"
                  @click="selectDate(i, j)"
                  :class="[
                       'py-1.5 hover:bg-gray-100 focus:z-10',
                       dateInRange(calculateDate(i, j)) ? 'bg-white' : 'bg-gray-50',
                       (isSelected(i, j) || isToday(i, j)) && 'font-semibold',
                       isSelected(i, j) && 'text-white',
                       !isSelected(i, j) && isCurrentMonth(i, j) && !isToday(i, j) && 'text-gray-900',
                       !isSelected(i, j) && !isCurrentMonth(i, j) && !isToday(i, j) && 'text-gray-400',
                       isToday(i, j) && !isSelected(i, j) && 'text-indigo-600',
                       j === 0 && 'rounded-tl-lg',
                       j === 6 && 'rounded-tr-lg',
                       j === i * j - 7 && 'rounded-bl-lg',
                       j === i * j - 1 && 'rounded-br-lg'
                      ]"
          >
            <time :datetime="calculateDate(i, j)"
                  :class="['mx-auto flex h-7 w-7 items-center justify-center rounded-full', isSelected(i, j) && isToday(i, j) && 'bg-indigo-600', isSelected(i, j) && isToday(i, j) && 'bg-gray-900']">
              {{ calculateDate (i, j).toFormat ('dd') }}
            </time>
          </button>
        </div>
        <button type="button"
                class="focus:outline-none mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Add event
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {PropType, defineProps, reactive} from "vue";
import {DateTime} from "luxon";

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

const selectDate = (week: number, day: number) => {
  calendar.selectedDate = calculateDate(week, day)
  closeCalendar()
}

const isToday = (week: number, day: number) => {
  const date = calculateDate(week, day)
  return DateTime.now().toISODate() === date.toISODate()
}

const isSelected = (week: number, day: number) => {
  const date = calculateDate(week, day)
  return calendar.selectedDate.toISODate() === date.toISODate()
}

const isCurrentMonth = (week: number, day: number) => {
  const date = calculateDate(week, day)
  return DateTime.now().toFormat('L') === date.toFormat('L')
}

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
  return calendar.startDate.plus({days: 7}).toFormat("LLLL yyyy");
};

const closeCalendar = (): void => {
  calendar.open = false;
};

const calculateDate = (week: number, day: number): DateTime => {
  const startOfMonth = calendar.startDate.startOf("month");
  const delta = (week - 1) * 7 + day - 1;
  return startOfMonth.plus({days: delta});
};

const previousMonth = (): void => {
  calendar.startDate = calendar.startDate.minus({months: 1});
};

const nextMonth = (): void => {
  calendar.startDate = calendar.startDate.plus({months: 1});
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
