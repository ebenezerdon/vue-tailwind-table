import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://www.fancensus.com/test',
  timeout: 10000, // 10 seconds timeout
})

// Simple caching mechanism
const cache = {}

const fetchData = async () => {
  const url = 'dataset1.json'

  if (cache[url]) {
    return cache[url]
  }

  try {
    const response = await axiosInstance.get(url)
    // Cache the response data
    cache[url] = response.data
    return response.data
  } catch (error) {
    console.log('Error fetching data:', error)
    if (!error.response) {
      throw new Error('Network/Timeout error - could not reach the server.')
    } else if (error.response.status >= 500) {
      throw new Error('Server error - try again later.')
    } else {
      throw new Error('Failed to fetch data: ' + error.message)
    }
  }
}

export default fetchData
