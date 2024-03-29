export interface Region {
  name: string
  count: number | null
}
type FetchError = { failed: true, error: any }

const AUTO_UPDATE_INTERVAL = 60000 // 60 seconds
let autoUpdateTimeout: number | NodeJS.Timeout

export const useStatsStore = defineStore({
  id: 'stats',

  state: () => ({
    regionsCollected: null as Region[] | null,
    regionsSorted: null as Region[] | null,
    errored: false,
    updating: false,
    showSorted: true,
    updateAttempt: 0
  }),

  getters: {
    regions: (state) => {
      if (state.showSorted) { return state.regionsSorted }
      return state.regionsCollected
    }
  },

  actions: {
    async updateStats (): Promise<void> {
      clearTimeout(autoUpdateTimeout)
      this.updating = true
      let collectedData
      let sortedData

      try {
        collectedData = await $fetch('/api/stats')
        sortedData = await $fetch('/api/sorted')
        this.updating = false

        if ((collectedData as FetchError).failed || (sortedData as FetchError).failed) {
          this.errored = true
          // eslint-disable-next-line no-console
          console.error({ collectedData, sortedData })
          this.updateAttempt++

          if (this.updateAttempt > 20) {
            this.updateAttempt = 0
          }

          if (this.updateAttempt > 3) {
            this.updating = true
            await new Promise(resolve => setTimeout(resolve, 1000))
            return this.updateStats()
          }
        } else {
          this.errored = false
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        this.errored = true
        this.updating = false
      }

      if (!this.errored) {
        this.updateAttempt = 0
        this.regionsCollected = collectedData as Region[]
        this.regionsSorted = sortedData as Region[]
      }

      if (this.regions !== null) {
        autoUpdateTimeout = setTimeout(() => this.updateStats(), AUTO_UPDATE_INTERVAL)
      }
    }
  }
})
