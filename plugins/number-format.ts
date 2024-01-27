const numberFormatter = new Intl.NumberFormat(
  'ru', { maximumFractionDigits: 0 }
)

const percentFormatter = new Intl.NumberFormat(
  'ru', { style: 'percent' }
)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatNumber: (value: number) => numberFormatter.format(value),
      formatPercent: (value: number) => percentFormatter.format(value),
      formatDecimal: (value: number, maximumFractionDigits = 2) => (
        new Intl.NumberFormat('ru', { maximumFractionDigits }).format(value)
      )
    }
  }
})
