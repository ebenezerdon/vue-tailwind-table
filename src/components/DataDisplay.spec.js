import { mount, flushPromises } from '@vue/test-utils'
import DataDisplay from '@/components/DataDisplay'
import fetchData from '@/services/DataService'

// Properly mock the fetchData function
jest.mock('@/services/DataService', () => ({
  __esModule: true, // tells Jest to treat the mock as a module.
  default: jest.fn(), // Mock the default export as a function.
}))

describe('DataDisplay.vue', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    fetchData.mockClear()
  })

  it('loads data on mount', async () => {
    const mockData = [
      {
        name: 'GGRecon',
        countrycode: 'UK',
        product: 'Red Dead Redemption 2',
        date: '2024-02-01 00:00:00',
        headline: 'GTA fans demand the ability to keep pet alligators in GTA 6',
      },
      {
        name: 'GGRecon',
        countrycode: 'UK',
        product: 'Hogwarts Legacy',
        date: '2024-02-01 00:00:00',
        headline: "Hogwarts Legacy 'Search the Tomb for the Helmet' walkthrough",
      },
      {
        name: 'GGRecon',
        countrycode: 'UK',
        product: 'Diablo 4',
        date: '2024-02-01 00:00:00',
        headline: 'Best endgame builds for each class in Diablo 4 Season 3',
      },
      {
        name: 'METRO UK',
        countrycode: 'UK',
        product: 'The Legend Of Zelda: Tears Of The Kingdom',
        date: '2024-02-01 00:01:19',
        headline: 'Silent Hill: The Short Message is a free PS5 game and it’s out now',
      },
    ]

    fetchData.mockResolvedValue(mockData)
    const wrapper = mount(DataDisplay)

    await flushPromises() // Wait for all promises to resolve

    expect(fetchData).toHaveBeenCalled()
    expect(wrapper.vm.data).toEqual(mockData)
  })

  it('displays error when fetchData fails', async () => {
    const errorMessage = 'Fetch error'
    fetchData.mockRejectedValue(new Error(errorMessage))
    const wrapper = mount(DataDisplay)

    await flushPromises() // Wait for all promises to resolve

    expect(fetchData).toHaveBeenCalled()
    expect(wrapper.text()).toContain(`Error: ${errorMessage}`)
  })
})
