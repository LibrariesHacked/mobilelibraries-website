import { rrulestr } from 'rrule'

/**
 * Converts an iCalendar RRULE string into a human-readable text description.
 *
 * @param {string} rrule - Recurrence rule string.
 * @returns {string} Human-readable recurrence description.
 */
const getText = rrule => {
  if (!rrule) return ''
  const rule = rrulestr(rrule)
  return rule.toText()
}

export { getText }
