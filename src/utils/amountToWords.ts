import { ToWords } from 'to-words'

const toWords = new ToWords({
  localeCode: 'en-IN', // Indian numbering system
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    currencyOptions: {
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
})

export function amountToWords(amount: number): string {
  return toWords.convert(amount)
}
