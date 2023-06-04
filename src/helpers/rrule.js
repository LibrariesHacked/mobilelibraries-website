import { rrulestr } from 'rrule'

const getText = rrule => {
  const rule = rrulestr(rrule)
  return rule.toText()
}

export { getText }
