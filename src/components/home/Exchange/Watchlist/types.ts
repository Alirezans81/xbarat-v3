export type CurrencyItem = {
  from: {
    code: string
    flag: string
  }
  to: {
    code: string
    flag: string
  }
  latest: number
  low: number
  high: number
}
