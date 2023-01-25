<script setup lang="ts">
import DateTimeInput from './components/DateTimeInput.vue'
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div class="flex m-6 justify-center">
    <DateTimeInput
      class="m-2"
      :min-date="new Date('1950-01-01')"
      :max-date="new Date()"
      :start-date="new Date()"
    />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
