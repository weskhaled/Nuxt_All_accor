import { useDateFormat } from '@vueuse/core'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import duration from 'dayjs/plugin/duration'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'

export function useDayjs() {
  dayjs().format()

  function setLang(l: string) {
    dayjs.locale(l)
  }

  dayjs.locale('fr')
  // dayjs.locale('en')
  dayjs.extend(duration)
  dayjs.extend(utc)
  dayjs.extend(isBetween)
  dayjs.extend(dayOfYear)
  dayjs.extend(isoWeek)
  dayjs.extend(weekOfYear)

  return {
    dayjs: dayjs || useDateFormat,
    setLang,
  }
}
