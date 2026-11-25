import { parseDate } from '../helpers/dates'
import { getText } from '../helpers/rrule'
import { apiGet } from '../helpers/url'

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
    this.localAuthorityId = json.local_authority_id
    this.localAuthorityCode = json.local_authority_code
    this.mobileId = json.mobile_id
    this.name = json.name
    this.frequency = json.frequency
    this.frequencyDescription = json.frequency ? getText(json.frequency) : ''
    this.start = parseDate(json.start)
    this.end = parseDate(json.end)
    this.timetable = json.timetable
    this.numberStops = Number(json.number_stops) || 0
    return this
  }
}

/**
 * Fetches all mobile library routes from the API, optionally filtered by local authority or mobile ID.
 *
 * @param {number|string} [localAuthorityId] - Optional local authority ID filter.
 * @param {number|string} [mobileId] - Optional mobile vehicle ID filter.
 * @returns {Promise<Route[]>} Array of Route instances.
 */
export async function getAllRoutes (localAuthorityId, mobileId) {
  try {
    const params = new URLSearchParams()
    if (localAuthorityId) params.set('local_authority_id', localAuthorityId)
    if (mobileId) params.set('mobile_id', mobileId)
    const queryString = params.toString()
    const path = queryString ? `/routes?${queryString}` : '/routes'
    const response = await apiGet(path)
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(r => new Route().fromJson(r))
    }
  } catch (e) {}
  return []
}

/**
 * Fetches a single mobile library route by its numeric ID.
 *
 * @param {number|string} id - Route ID.
 * @returns {Promise<Route|null>} Route instance or null.
 */
export async function getRouteById (id) {
  try {
    const response = await apiGet(`/routes/${id}`)
    if (response && response.data) {
      return new Route().fromJson(response.data)
    }
  } catch (e) {}
  return null
}
