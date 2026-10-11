import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { getText } from '../helpers/rrule'
import config from '../helpers/config.json'

dayjs.extend(relativeTime)

/**
 * Represents a mobile library route and its schedule recurrence.
 */
export class Route {
  /**
   * @param {Partial<Route>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw route JSON from the API.
   * @returns {Route} This instance.
   */
  fromJson (json) {
    this.id = json.id
    this.organisationId = json.organisation_id
    this.mobileId = json.mobile_id
    this.name = json.name
    this.frequency = json.frequency
    this.frequencyDescription = json.frequency ? getText(json.frequency) : ''
    this.start = dayjs(json.start)
    this.end = dayjs(json.end)
    this.timetable = json.timetable
    this.numberStops = json.number_stops
    return this
  }
}

/**
 * Fetches all mobile library routes from the API.
 *
 * @returns {Promise<Route[]>} Array of Route instances.
 */
export async function getAllRoutes () {
  const response = await axios.get(config.api + '/routes')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(r => new Route().fromJson(r))
  } else {
    return []
  }
}
