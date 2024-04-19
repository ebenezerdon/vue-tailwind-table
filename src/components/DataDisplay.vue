<template>
  <div class="p-6">
    <div v-if="error" class="text-red-500">Error: {{ error }}</div>
    <div v-if="data">
      <!-- Country Grouped Table -->
      <h2 class="text-lg font-bold mb-4">Data Grouped by Country</h2>
      <div v-for="(items, country) in groupedByCountry" :key="country" class="mb-6">
        <h3 @click="toggleDetail(country)" class="cursor-pointer underline text-blue-600">
          {{ country }}
        </h3>
        <table v-if="expandedCountries[country]" class="w-full table-auto mt-2">
          <thead>
            <tr class="bg-gray-200">
              <th class="px-4 py-2">Product</th>
              <th class="px-4 py-2">Headline</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.date">
              <td class="border px-4 py-2">{{ item.product }}</td>
              <td class="border px-4 py-2">{{ item.headline }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Product Grouped Table -->
      <h2 class="text-lg font-bold mb-4">Data Grouped by Product</h2>
      <table class="w-full table-auto mb-6">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2">Product</th>
            <th class="px-4 py-2">Number of Mentions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, product) in groupedByProduct" :key="product">
            <td class="border px-4 py-2">{{ product }}</td>
            <td class="border px-4 py-2">{{ count }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Visualization - Chart.js -->
      <bar-chart :data="chartData" :options="chartOptions"></bar-chart>
    </div>
  </div>
</template>

<script>
import fetchData from '@/services/DataService'
import { BarChart } from 'vue-chartjs'
import { ref, onMounted, reactive, computed } from 'vue'

export default {
  components: {
    BarChart,
  },
  setup() {
    const data = ref(null)
    const error = ref(null)
    const expandedCountries = reactive({})
    const chartData = ref(null)
    const chartOptions = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
    })

    const toggleDetail = (country) => {
      expandedCountries[country] = !expandedCountries[country]
    }

    const loadData = async () => {
      try {
        data.value = await fetchData()
        generateChartData()
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

    const groupedByProduct = computed(() => {
      const productCounts = {}
      if (data.value) {
        for (const item of data.value) {
          const product = item.product
          if (!productCounts[product]) {
            productCounts[product] = 0
          }
          productCounts[product]++
        }
      }
      return productCounts
    })

    const generateChartData = () => {
      const countryCounts = {}
      data.value.forEach((item) => {
        const country = item.countrycode
        if (!countryCounts[country]) {
          countryCounts[country] = 0
        }
        countryCounts[country]++
      })

      chartData.value = {
        labels: Object.keys(countryCounts),
        datasets: [
          {
            label: 'Number of Activities',
            data: Object.values(countryCounts),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      }
    }

    onMounted(loadData)

    return {
      data,
      error,
      expandedCountries,
      toggleDetail,
      groupedByCountry,
      groupedByProduct,
      chartData,
      chartOptions,
    }
  },
}
</script>
