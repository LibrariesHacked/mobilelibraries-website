import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import config from '../helpers/config.json'

dayjs.extend(relativeTime)

export class Route {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.id = json.id
    this.organisationId = json.organisation_id
    this.mobileId = json.mobile_id
    this.name = json.name
    this.frequency = json.frequency
    this.start = dayjs(json.start)
    this.end = dayjs(json.end)
    this.timetable = json.timetable
    this.numberStops = json.number_stops
    return this
  }
}

export async function getAllRoutes () {
  const response = await axios.get(config.api + '/routes')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(r => new Route().fromJson(r))
  } else {
    return []
  }
}
