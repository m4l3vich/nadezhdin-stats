export interface Region {
  name: string
  count: number
}
type FetchError = { failed: true, error: any }

const AUTO_UPDATE_INTERVAL = 60000 // 60 seconds
let autoUpdateTimeout: number | NodeJS.Timeout

export const useStatsStore = defineStore({
  id: 'stats',

  state: () => ({
    regions: null as Region[] | null,
    errored: false,
    updating: false,
    updateAttempt: 0
  }),

  actions: {
    async updateStats (): Promise<void> {
      clearTimeout(autoUpdateTimeout)
      this.updating = true
      const { data, error } = await useFetch('/api/stats')
      this.updating = false

      if (error.value || (data.value as FetchError).failed) {
        this.errored = true
        // eslint-disable-next-line no-console
        console.error(error.value, data.value)
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

      if (!this.errored) {
        this.updateAttempt = 0
        this.regions = data.value as Region[]
      }

      if (this.regions !== null) {
        autoUpdateTimeout = setTimeout(() => this.updateStats(), AUTO_UPDATE_INTERVAL)
      }
    }
  }
})
