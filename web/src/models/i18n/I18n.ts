export default class I18n {
  constructor () {
    this.numberFormatter = new Intl.NumberFormat()
  }

  number (value: number) {
    return this.numberFormatter.format(value)
  }

  numberFormatter: Intl.NumberFormat
}
