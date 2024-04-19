<template>
  <div class="p-6">
    <div v-if="error" class="text-red-500">Error: {{ error }}</div>
    <div v-if="data">
      <!-- Horizontal Country List -->
      <div class="flex overflow-x-auto mb-4">
        <button
          v-for="country in countries"
          :key="country"
          @click="selectedCountry = country"
          :class="{ 'text-blue-600': selectedCountry === country, 'text-gray-600': selectedCountry !== country }"
          class="whitespace-nowrap px-4 py-2 hover:text-blue-800 focus:outline-none"
        >
          {{ country }}
        </button>
      </div>

      <!-- Country Details Table -->
      <div v-if="selectedCountry">
        <h2 class="text-lg font-bold mb-4">Data for {{ selectedCountry }}</h2>
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2">Product</th>
              <th class="px-4 py-2">Headline</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in groupedByCountry[selectedCountry]" :key="item.date">
              <td class="border px-4 py-2">{{ item.product }}</td>
              <td class="border px-4 py-2">{{ item.headline }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fetchData from '@/services/DataService'
import { ref, onMounted, computed } from 'vue'

export default {
  setup() {
    const data = ref(null)
    const error = ref(null)
    const selectedCountry = ref(null)

    const loadData = async () => {
      try {
        data.value = await fetchData()
      } catch (err) {
        error.value = err.message
      }
    }

    const groupedByCountry = computed(() => {
      const groups = {}
      if (data.value) {
        for (const item of data.value) {
          const country = item.countrycode
          if (!groups[country]) {
            groups[country] = []
          }
          groups[country].push(item)
        }
      }
      return groups
    })

    const countries = computed(() => {
      return Object.keys(groupedByCountry.value).sort()
    })

    onMounted(loadData)

    return {
      data,
      error,
      selectedCountry,
      groupedByCountry,
      countries,
    }
  },
}
</script>
