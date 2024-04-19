<template>
  <div id="app" class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <data-display></data-display>
    </div>
  </div>
</template>

<script>
import DataDisplay from './components/DataDisplay.vue'

export default {
  name: 'App',
  components: {
    DataDisplay,
  },
}
</script>
