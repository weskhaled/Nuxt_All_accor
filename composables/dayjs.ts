import { useDateFormat } from '@vueuse/core'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'

export function useDayjs() {
  dayjs().format()

  function setLang(l: string) {
    dayjs.locale(l)
  }

  dayjs.locale('fr')
  dayjs.extend(duration)
  dayjs.extend(utc)
  dayjs.extend(isBetween)

  return {
    dayjs: dayjs || useDateFormat,
    setLang,
  }
}
