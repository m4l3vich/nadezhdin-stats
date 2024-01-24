import { parse } from 'node-html-parser'

const STATS_URL = 'https://nadezhdin2024.ru/addresses'

interface StatsRegion {
  name: string,
  count: number | null
}

type Stats = StatsRegion[]
type FetchError = { failed: true, error: any }

export default defineEventHandler(async (): Promise<Stats | FetchError> => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 9000) // 9s fetch timeout

  try {
    const resp = await fetch(STATS_URL, { signal: controller.signal })
    const text = await resp.text()

    const document = parse(text)
    const regions = document.querySelectorAll('.addresses-page__region')

    return regions.map((el) => {
      const name = el.querySelector('h3.subheading')?.innerText ?? ''
      const progress = el.querySelector('.progressbar__el__text')

      if (!progress) { return { name, count: null } }

      let match = progress.innerText.match(/(\d+) \/ \d+/)
      if (!match) {
        match = progress.innerText.match(/ (\d+)/)
        if (!match) { return { name, count: null } }
      }

      return { name, count: Number(match[1]) }
    })
  } catch (err) {
    return { failed: true, error: err }
  }
})
