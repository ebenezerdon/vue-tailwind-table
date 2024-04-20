<template>
  <div class="p-6 h-screen">
    <div v-if="error" class="text-red-500">Error: {{ error }}</div>

    <!-- Show loading text -->
    <div v-if="!data" class="mt-4">Loading data...</div>

    <div v-if="data">
      <!-- Tab Headers -->
      <div class="flex border-b">
        <button
          class="py-2 px-4 text-sm font-medium text-center"
          :class="{ 'border-b-2 border-blue-500': activeTab === 'countries' }"
          @click="activeTab = 'countries'"
        >
          Countries
        </button>
        <button
          class="py-2 px-4 text-sm font-medium text-center"
          :class="{ 'border-b-2 border-blue-500': activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          Products
        </button>
        <button
          class="py-2 px-4 text-sm font-medium text-center"
          :class="{ 'border-b-2 border-blue-500': activeTab === 'graph' }"
          @click="activeTab = 'graph'"
        >
          Graph
        </button>
      </div>

      <!-- Country Details Tab -->
      <div v-if="activeTab === 'countries'" class="mt-4">
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

      <!-- Product Activities Tab -->
      <div v-if="activeTab === 'products'" class="mt-4">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2">Product</th>
              <th class="px-4 py-2">Number of Activities</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(count, product) in productActivities" :key="product">
              <td class="border px-4 py-2">{{ product }}</td>
              <td class="border px-4 py-2">{{ count }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Graph Tab -->
      <div v-if="activeTab === 'graph'" class="mt-4">
        <BarChart :chartData="chartData" :options="{ responsive: true, maintainAspectRatio: false }" />
      </div>
    </div>
  </div>
</template>

<script>
import fetchData from '@/services/DataService'
import { ref, onMounted, computed } from 'vue'
import { Chart, CategoryScale, BarController, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { BarChart } from 'vue-chart-3'

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend)

export default {
  setup() {
    const data = ref(null)
    const error = ref(null)
    const selectedCountry = ref(null)
    const activeTab = ref('countries') // Default tab

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

    const productActivities = computed(() => {
      const activities = {}
      if (data.value) {
        for (const item of data.value) {
          const product = item.product
          if (!activities[product]) {
            activities[product] = 0
          }
          activities[product] += 1
        }
      }
      return activities
    })

    const countries = computed(() => {
      return Object.keys(groupedByCountry.value).sort()
    })

    const chartData = computed(() => {
      if (!data.value || !Object.keys(groupedByCountry.value).length) {
        console.error('No data available for chart.')
        return { labels: [], datasets: [] }
      }

      const labels = countries.value
      const dataPoints = labels.map((country) => groupedByCountry.value[country].length)

      return {
        labels,
        datasets: [
          {
            label: 'Number of Activities',
            data: dataPoints,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }
    })

    onMounted(() => {
      loadData().then(() => {
        console.log('Data loaded', data.value)
      })
    })

    return {
      data,
      error,
      selectedCountry,
      activeTab,
      groupedByCountry,
      productActivities,
      countries,
      chartData,
    }
  },
  components: {
    BarChart,
  },
}
</script>
