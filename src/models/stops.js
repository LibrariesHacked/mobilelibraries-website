import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { getText } from '../helpers/rrule'

import config from '../helpers/config.json'

dayjs.extend(relativeTime)

/**
 * Represents a mobile library stop and its schedule details.
 */
export class Stop {
  /**
   * @param {Partial<Stop>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw stop JSON from the API.
   * @returns {Stop} This instance.
   */
  fromJson (json) {
    this.id = json.id
    this.routeIds = json.route_ids
    this.routeNames = json.route_names
    this.mobileIds = json.mobile_ids
    this.mobileNames = json.mobile_names
    this.organisationId = json.organisation_id
    this.organisationName = json.organisation_name
    this.name = json.name
    this.community = json.community
    this.address = json.address
    this.postcode = json.postcode
    this.arrivalTimes = json.arrival_times
    this.departureTimes = json.departure_times
    this.routeStart = dayjs(json.route_start)
    this.routeEnd = dayjs(json.route_end)
    this.routeDays = json.route_days
    this.routeFrequencies = json.route_frequencies
    this.routeFrequencyDescriptions = json.route_frequencies.map(f =>
      getText(f)
    )
    this.routeSchedule = json.route_schedule.map(s => dayjs(s))
    this.timetable = json.timetable
    this.longitude = json.longitude
    this.latitude = json.latitude
    this.distance = json.distance
    return this
  }

  /**
   * URL to download the iCalendar (`.ics`) file for this stop.
   *
   * @returns {string} ICS download URL.
   */
  get icsUrl () {
    return `${config.api}/stops/${this.id}/ics`
  }

  /**
   * URL to view/print the PDF timetable for this stop.
   *
   * @returns {string} PDF timetable URL.
   */
  get pdfUrl () {
    return `${config.api}/stops/${this.id}/pdf`
  }

  /**
   * Formatted date and time string for the next scheduled visit.
   *
   * @returns {string} Formatted next visit date/time.
   */
  get nextVisitFormatted () {
    if (!this.routeSchedule || this.routeSchedule.length === 0) return ''
    return this.routeSchedule[0].format('dddd Do MMMM h:mma')
  }
}

/**
 * Fetches a paginated, sorted, and filtered list of stops from the API.
 *
 * @param {{ page: number, pageSize: number, orderBy?: { field: string, direction: string } }} query - Pagination and sort options.
 * @param {number[]} searchPosition - Optional `[longitude, latitude]` coordinates.
 * @param {number} distance - Search distance in meters.
 * @param {Array<string|number>} organisationFilter - Selected organisation IDs.
 * @param {Array<string|number>} mobileFilter - Selected mobile library IDs.
 * @param {Array<string|number>} routeFilter - Selected route IDs.
 * @returns {Promise<{ stops: Stop[], totalRowCount: number, currentPage: number }>} Paginated stops result.
 */
export async function getQueryStops (
  query,
  searchPosition,
  distance,
  organisationFilter,
  mobileFilter,
  routeFilter
) {
  let url = `${config.api}/stops?page=${query.page + 1}&limit=${query.pageSize}`

  if (query.orderBy && query.orderBy.field) {
    url = `${url}&sort=${query.orderBy.field}&direction=${query.orderBy.direction}`
  }

  if (searchPosition && searchPosition.length > 1) {
    url = `${url}&longitude=${searchPosition[0]}&latitude=${searchPosition[1]}`
  }

  if (distance && distance !== '') url = `${url}&distance=${distance}`

  if (organisationFilter.length > 0) {
    url = `${url}&organisation_ids=${organisationFilter.join('|')}`
  }

  if (mobileFilter.length > 0) {
    url = `${url}&mobile_ids=${mobileFilter.join('|')}`
  }

  if (routeFilter.length > 0) {
    url = `${url}&route_ids=${routeFilter.join('|')}`
  }

  const response = await axios.get(url)
  if (response && response.data && response.data.length > 0) {
    return {
      stops: response.data.map(s => new Stop().fromJson(s)),
      totalRowCount: parseInt(response.headers['x-total-count']),
      currentPage: parseInt(response.headers['x-page'])
    }
  } else {
    return { stops: [], totalRowCount: 0, currentPage: 1 }
  }
}

/**
 * Fetches all stops from the API.
 *
 * @returns {Promise<Stop[]>} Array of Stop instances.
 */
export async function getAllStops () {
  const response = await axios.get(`${config.api}/stops`)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => new Stop().fromJson(s))
  } else {
    return []
  }
}

/**
 * Fetches a single stop by its ID.
 *
 * @param {string|number} id - Stop ID.
 * @returns {Promise<Stop|object>} Stop instance or empty object.
 */
export async function getStopById (id) {
  const response = await axios.get(`${config.api}/stops/${id}`)
  if (response && response.data) {
    return new Stop().fromJson(response.data)
  } else {
    return {}
  }
}
