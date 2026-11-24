import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { getText } from '../helpers/rrule'

import config from '../helpers/config.json'

dayjs.extend(relativeTime)

const SORT_FIELD_MAP = {
  localAuthorityName: 'local_authority_name',
  localAuthorityCode: 'local_authority_code'
}

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
    this.routeIds = json.route_ids || []
    this.routeNames = json.route_names || []
    this.mobileIds = json.mobile_ids || []
    this.mobileNames = json.mobile_names || []
    this.localAuthorityId = json.local_authority_id
    this.localAuthorityName = json.local_authority_name
    this.localAuthorityColour = json.local_authority_colour
    this.localAuthorityCode = json.local_authority_code
    this.name = json.name
    this.community = json.community
    this.address = json.address
    this.postcode = json.postcode
    this.arrivalTimes = json.arrival_times || []
    this.departureTimes = json.departure_times || []
    this.routeStart = json.route_start ? dayjs(json.route_start) : null
    this.routeEnd = json.route_end ? dayjs(json.route_end) : null
    this.routeDays = json.route_days || []
    this.type = json.type
    this.exceptions = json.exceptions || []
    this.routeFrequencies = json.route_frequencies || []
    this.routeFrequencyDescriptions = (json.route_frequencies || []).map(f =>
      getText(f)
    )
    this.routeSchedule = (json.route_schedule || []).map(s => dayjs(s))
    this.timetable = json.timetable
    this.longitude = json.longitude != null ? Number(json.longitude) : null
    this.latitude = json.latitude != null ? Number(json.latitude) : null
    this.distance = json.distance != null ? Number(json.distance) : null
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
 * @param {Array<string|number>} localAuthorityFilter - Selected local authority IDs.
 * @param {Array<string|number>} mobileFilter - Selected mobile library IDs.
 * @param {Array<string|number>} routeFilter - Selected route IDs.
 * @param {Array<string>} [localAuthorityCodeFilter=[]] - Optional selected 9-character GSS codes.
 * @returns {Promise<{ stops: Stop[], totalRowCount: number, currentPage: number }>} Paginated stops result.
 */
export async function getQueryStops (
  query,
  searchPosition,
  distance,
  localAuthorityFilter = [],
  mobileFilter = [],
  routeFilter = [],
  localAuthorityCodeFilter = []
) {
  let url = `${config.api}/stops?page=${query.page + 1}&limit=${query.pageSize}`

  if (query.orderBy && query.orderBy.field) {
    const sortField =
      SORT_FIELD_MAP[query.orderBy.field] || query.orderBy.field
    url = `${url}&sort=${sortField}&direction=${query.orderBy.direction}`
  }

  if (searchPosition && searchPosition.length > 1) {
    url = `${url}&longitude=${searchPosition[0]}&latitude=${searchPosition[1]}`
  }

  if (distance && distance !== '') url = `${url}&distance=${distance}`

  if (localAuthorityFilter && localAuthorityFilter.length > 0) {
    url = `${url}&local_authority_ids=${localAuthorityFilter.join('|')}`
  }

  if (localAuthorityCodeFilter && localAuthorityCodeFilter.length > 0) {
    url = `${url}&local_authority_codes=${localAuthorityCodeFilter.join('|')}`
  }

  if (mobileFilter && mobileFilter.length > 0) {
    url = `${url}&mobile_ids=${mobileFilter.join('|')}`
  }

  if (routeFilter && routeFilter.length > 0) {
    url = `${url}&route_ids=${routeFilter.join('|')}`
  }

  try {
    const response = await axios.get(url)
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return {
        stops: response.data.map(s => new Stop().fromJson(s)),
        totalRowCount: parseInt(response.headers['x-total-count'], 10) || response.data.length,
        currentPage: parseInt(response.headers['x-page'], 10) || 1
      }
    }
  } catch (e) {}
  return { stops: [], totalRowCount: 0, currentPage: 1 }
}

/**
 * Fetches the nearest stops to a given `[longitude, latitude]` coordinate pair.
 *
 * @param {number[]} location - `[longitude, latitude]` coordinates.
 * @param {number} [limit=1] - Maximum number of nearest stops to return.
 * @returns {Promise<Stop[]>} Array of nearest Stop instances.
 */
export async function getNearestStops (location, limit = 1) {
  try {
    const response = await axios.get(
      `${config.api}/stops/nearest?longitude=${location[0]}&latitude=${location[1]}&limit=${limit}`
    )
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(s => new Stop().fromJson(s))
    }
  } catch (e) {}
  return []
}

/**
 * Fetches all stops from the API.
 *
 * @returns {Promise<Stop[]>} Array of Stop instances.
 */
export async function getAllStops () {
  try {
    const response = await axios.get(`${config.api}/stops`)
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(s => new Stop().fromJson(s))
    }
  } catch (e) {}
  return []
}

/**
 * Fetches a single stop by its ID.
 *
 * @param {string|number} id - Stop ID.
 * @returns {Promise<Stop|object>} Stop instance or empty object.
 */
export async function getStopById (id) {
  try {
    const response = await axios.get(`${config.api}/stops/${id}`)
    if (response && response.data) {
      return new Stop().fromJson(response.data)
    }
  } catch (e) {}
  return {}
}
