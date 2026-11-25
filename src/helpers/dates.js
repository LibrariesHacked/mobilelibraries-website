/**
 * Date and time formatting for UK mobile library timetables using built-in
 * `Intl` APIs (`Intl.DateTimeFormat`, `Intl.PluralRules`) rather than Moment/Day.js.
 */

/** Time zone that all UK timetable times are expressed in. */
export const TIMEZONE = 'Europe/London'

const ordinalRules = new Intl.PluralRules('en-GB', { type: 'ordinal' })
const ordinalSuffixes = { one: 'st', two: 'nd', few: 'rd', other: 'th' }

const weekdayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  timeZone: TIMEZONE
})
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  timeZone: TIMEZONE
})
const monthFormat = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  timeZone: TIMEZONE
})
const monthYearFormat = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: TIMEZONE
})
const isoDayFormat = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: TIMEZONE
})
const hourMinutePartsFormat = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: TIMEZONE
})

/**
 * Safely parses an ISO timestamp, Postgres timestamp (`YYYY-MM-DD HH:mm:ss`), or Date into a `Date`.
 *
 * @param {Date|string|number|null|undefined} value - Raw date input.
 * @returns {Date|null} Parsed Date instance, or `null` if invalid/empty.
 */
export const parseDate = value => {
  if (!value) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  const normalized =
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value)
      ? value.replace(' ', 'T')
      : value
  const parsed = new Date(normalized)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Returns a day number with its English ordinal suffix (e.g. `1st`, `2nd`, `3rd`, `30th`).
 *
 * @param {number} day - Day of the month (1–31).
 * @returns {string} Ordinal day string.
 */
export const formatOrdinalDay = day =>
  `${day}${ordinalSuffixes[ordinalRules.select(day)] || 'th'}`

/**
 * Formats a Date's time of day in compact UK 12-hour format (e.g. `12:40pm`, `9:05am`).
 *
 * @param {Date} date - Valid Date object.
 * @returns {string} Formatted 12-hour time string.
 */
const format12HourFromDate = date => {
  const parts = hourMinutePartsFormat.formatToParts(date)
  const hour = parts.find(p => p.type === 'hour')?.value || ''
  const minute = parts.find(p => p.type === 'minute')?.value || '00'
  const dayPeriod = (
    parts.find(p => p.type === 'dayPeriod')?.value || ''
  ).toLowerCase()
  return `${hour}:${minute}${dayPeriod}`
}

/**
 * Formats a date in long UK style with an ordinal day (e.g. `1st December 2026`).
 *
 * @param {Date|string|number} date - The date to format.
 * @returns {string} Formatted date string, or `''` if invalid.
 */
export const formatLongDate = date => {
  const value = parseDate(date)
  if (!value) return ''
  const day = Number(dayFormat.format(value))
  return `${formatOrdinalDay(day)} ${monthYearFormat.format(value)}`
}

/**
 * Formats a visit timestamp in full UK timetable style (e.g. `Monday 30th November 12:40pm`),
 * replacing Moment's `'dddd Do MMMM h:mma'` pattern without external libraries.
 *
 * @param {Date|string|number} date - Scheduled visit timestamp.
 * @returns {string} Formatted visit date and time, or `''` if invalid.
 */
export const formatVisitDateTime = date => {
  const value = parseDate(date)
  if (!value) return ''
  const weekday = weekdayFormat.format(value)
  const day = Number(dayFormat.format(value))
  const month = monthFormat.format(value)
  const time = format12HourFromDate(value)
  return `${weekday} ${formatOrdinalDay(day)} ${month} ${time}`
}

/**
 * Formats a 24-hour time string (`HH:mm:ss` or `HH:mm`) into compact 12-hour UK format (e.g. `12:40pm`).
 *
 * @param {string} time - Time string in `HH:mm` or `HH:mm:ss` format.
 * @returns {string} Formatted time string, or `''` if missing.
 */
export const formatTime = time => {
  const match = /^(\d{1,2}):(\d{2})/.exec(time ?? '')
  if (!match) return ''
  const hours24 = Number(match[1])
  const minutes = match[2]
  const period = hours24 >= 12 ? 'pm' : 'am'
  const hours12 = hours24 % 12 || 12
  return `${hours12}:${minutes}${period}`
}

/**
 * Formats an arrival and departure time pair as a range (e.g. `12:40pm – 1:00pm`).
 *
 * @param {string} [arrivalTime] - Arrival time in `HH:mm:ss` format.
 * @param {string} [departureTime] - Departure time in `HH:mm:ss` format.
 * @returns {string} Formatted time window string.
 */
export const formatTimeWindow = (arrivalTime, departureTime) => {
  const start = formatTime(arrivalTime)
  const end = formatTime(departureTime)
  return start && end ? `${start} – ${end}` : start || end
}

/**
 * Checks whether two dates fall on the same calendar day in the `Europe/London` timezone.
 *
 * @param {Date|string|number} dateA - First date.
 * @param {Date|string|number} dateB - Second date.
 * @returns {boolean} True if both dates are on the same UK calendar day.
 */
export const isSameDay = (dateA, dateB) => {
  const a = parseDate(dateA)
  const b = parseDate(dateB)
  if (!a || !b) return false
  return isoDayFormat.format(a) === isoDayFormat.format(b)
}

/**
 * Formats the relative duration between `targetDate` and `now` (e.g. `"in 25 minutes"`,
 * `"15 minutes ago"`, or `"25 minutes"` when `withoutSuffix` is true).
 *
 * @param {Date|string|number} targetDate - Target date/time.
 * @param {boolean} [withoutSuffix=false] - Omit `"in "` / `" ago"` prefix/suffix.
 * @param {Date} [now=new Date()] - Reference timestamp.
 * @returns {string} Human-readable relative duration.
 */
export const formatRelativeTime = (
  targetDate,
  withoutSuffix = false,
  now = new Date()
) => {
  const target = parseDate(targetDate)
  if (!target) return ''

  const diffSeconds = Math.round((target.getTime() - now.getTime()) / 1000)
  const absSeconds = Math.abs(diffSeconds)
  const absMinutes = Math.round(absSeconds / 60)
  const absHours = Math.round(absMinutes / 60)
  const absDays = Math.round(absHours / 24)

  let phrase
  if (absSeconds < 45) {
    phrase = 'a few seconds'
  } else if (absMinutes <= 1) {
    phrase = 'a minute'
  } else if (absMinutes < 45) {
    phrase = `${absMinutes} minutes`
  } else if (absMinutes < 90) {
    phrase = 'an hour'
  } else if (absHours < 22) {
    phrase = `${absHours} hours`
  } else if (absHours < 36) {
    phrase = 'a day'
  } else {
    phrase = `${absDays} days`
  }

  if (withoutSuffix) return phrase
  return diffSeconds >= 0 ? `in ${phrase}` : `${phrase} ago`
}
