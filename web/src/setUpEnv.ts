import dayjs from 'dayjs'
import utcDayjsPlugin from 'dayjs/plugin/utc'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'

export default function setUpEnv () {
  dayjs.extend(utcDayjsPlugin)
  dayjs.extend(relativeTimePlugin)
  dayjs.extend((_option, dayjsClass, _dayjsFactory) => {
    const oldFormat = dayjsClass.prototype.format

    dayjsClass.prototype.format = function (formatString) {
      return oldFormat.bind(this)(formatString ?? 'YYYY-MM-DDTHH:mm:ss')
    }
  })
}
