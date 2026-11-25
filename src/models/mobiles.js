import {
  formatRelativeTime,
  isSameDay,
  parseDate
} from '../helpers/dates'
import { apiGet } from '../helpers/url'

const STATUS_MESSAGES = {
  offRoad: 'Not out today',
  preRoute: 'Arriving at ',
  atStop: 'At ',
  betweenStops: 'Arriving at ',
  postRoute: 'Finished for the day'
}

/**
 * Represents a mobile library vehicle.
 */
export class Mobile {
  /**
   * @param {Partial<Mobile>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw mobile JSON from the API.
   * @returns {Mobile} This instance.
   */
  fromJson (json) {
    this.id = json.id
    this.localAuthorityId = json.local_authority_id
    this.localAuthorityCode = json.local_authority_code
    this.name = json.name
    this.timetable = json.timetable
    this.numberRoutes = Number(json.number_routes) || 0
    this.numberStops = Number(json.number_stops) || 0
    return this
  }

  /**
   * Formatted route count label (e.g. `"5 routes"` or `"1 route"`).
   *
   * @returns {string} Route count description.
   */
  get routeCountDescription () {
    return `${this.numberRoutes} route${this.numberRoutes === 1 ? '' : 's'}`
  }

  /**
   * Formatted stop count label (e.g. `"42 stops"` or `"1 stop"`).
   *
   * @returns {string} Stop count description.
   */
  get stopCountDescription () {
    return `${this.numberStops} stop${this.numberStops === 1 ? '' : 's'}`
  }

  /**
   * Formats the display title combining the local authority name and mobile name.
   *
   * @param {import('./localAuthorities').LocalAuthority} [localAuthority] - Owning local authority.
   * @param {string} [separator=' '] - Separator between authority and mobile name.
   * @returns {string} Combined display title.
   */
  getDisplayTitle (localAuthority, separator = ' ') {
    return (localAuthority ? localAuthority.name + separator : '') + this.name
  }
}

/**
 * Represents the nearest stop for a mobile library relative to a search location.
 */
export class MobileNearestStop {
  /**
   * @param {Partial<MobileNearestStop>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw nearest-mobile JSON from the API.
   * @returns {MobileNearestStop} This instance.
   */
  fromJson (json) {
    this.mobileId = json.mobile_id
    this.stopId = json.stop_id
    this.stopName = json.stop_name
    this.stopDistance = Number(json.stop_distance) || 0
    return this
  }
}

/**
 * Represents the real-time or estimated location and schedule status of a mobile library.
 * The backend provides a 60-second `routeSection` LineString sampled at 500ms intervals,
 * allowing smooth client-side position interpolation between 30-second API polls.
 */
export class MobileLocation {
  /**
   * @param {Partial<MobileLocation>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw mobile location JSON from the API.
   * @returns {MobileLocation} This instance.
   */
  fromJson (json) {
    this.mobileId = json.mobile_id
    this.currentStopId = json.current_stop_id
    this.currentStopDeparture = parseDate(json.current_stop_departure)
    this.currentStopName = json.current_stop_name
    this.previousStopId = json.previous_stop_id
    this.previousStopDeparture = parseDate(json.previous_stop_departure)
    this.previousStopName = json.previous_stop_name
    this.nextStopId = json.next_stop_id
    this.nextStopArrival = parseDate(json.next_stop_arrival)
    this.nextStopName = json.next_stop_name
    this.updated = parseDate(json.updated)
    this.receivedAt = new Date()
    this.updateType = json.update_type
    this.geoX = json.geox != null ? Number(json.geox) : null
    this.geoY = json.geoy != null ? Number(json.geoy) : null
    this.routeSection = json.route_section
    return this
  }

  /**
   * Whether this vehicle has a multi-point `routeSection` for client-side interpolation.
   *
   * @returns {boolean} True if currently moving along a route section.
   */
  get isMoving () {
    return Boolean(this.routeSection?.coordinates?.length > 1)
  }

  /**
   * Interpolates the mobile library's current `[longitude, latitude]` coordinates
   * along its active `routeSection` (sampled every 500ms) if available.
   * Uses `receivedAt` as a clock-skew-safe fallback if server/client clocks differ.
   *
   * @param {Date} [now=new Date()] - Reference timestamp.
   * @returns {number[]|null} `[longitude, latitude]` coordinates or `null` if unavailable.
   */
  getCoordinates (now = new Date()) {
    if (this.geoX == null || this.geoY == null) return null
    const coords = this.routeSection?.coordinates
    if (!coords || coords.length === 0) return [this.geoX, this.geoY]

    const baseTime = this.receivedAt || this.updated
    if (!baseTime) return [this.geoX, this.geoY]

    const elapsedMs = Math.max(0, now.getTime() - baseTime.getTime())
    const index = Math.min(coords.length - 1, Math.round(elapsedMs / 500))
    return coords[index] || [this.geoX, this.geoY]
  }

  /**
   * Computes the current operational status of the mobile library.
   *
   * @param {Date} [now=new Date()] - Reference timestamp.
   * @returns {{
   *   type: 'offRoad'|'preRoute'|'atStop'|'betweenStops'|'postRoute',
   *   message: string,
   *   textFormat: string,
   *   args?: Array<any>
   * }} Status object.
   */
  getStatus (now = new Date()) {
    // 1. Currently parked at a scheduled stop
    if (this.currentStopId && this.currentStopDeparture) {
      const stopRemaining = formatRelativeTime(
        this.currentStopDeparture,
        true,
        now
      )
      return {
        type: 'atStop',
        message: STATUS_MESSAGES.atStop,
        textFormat: `${STATUS_MESSAGES.atStop}${this.currentStopName} for ${stopRemaining}`,
        args: [
          { stopName: this.currentStopName, stopId: this.currentStopId },
          stopRemaining
        ]
      }
    }

    // 2. En route to an upcoming stop today (either before first stop or between stops)
    if (this.nextStopId && this.nextStopArrival) {
      if (!isSameDay(this.nextStopArrival, now)) {
        return {
          type: 'offRoad',
          message: STATUS_MESSAGES.offRoad,
          textFormat: STATUS_MESSAGES.offRoad
        }
      }
      const type = this.previousStopId ? 'betweenStops' : 'preRoute'
      const arrival = formatRelativeTime(this.nextStopArrival, false, now)
      return {
        type,
        message: STATUS_MESSAGES[type],
        textFormat: `${STATUS_MESSAGES[type]}${this.nextStopName} ${arrival}`,
        args: [
          { stopName: this.nextStopName, stopId: this.nextStopId },
          arrival
        ]
      }
    }

    // 3. No more stops today after departing the final stop of the route
    if (this.previousStopId) {
      return {
        type: 'postRoute',
        message: STATUS_MESSAGES.postRoute,
        textFormat: STATUS_MESSAGES.postRoute
      }
    }

    return {
      type: 'offRoad',
      message: STATUS_MESSAGES.offRoad,
      textFormat: STATUS_MESSAGES.offRoad
    }
  }

  /**
   * Returns whether the mobile library is currently active on the road today.
   *
   * @param {ReturnType<MobileLocation['getStatus']>} [status=this.getStatus()] - Precomputed status.
   * @returns {boolean} True if active on route today.
   */
  isActive (status = this.getStatus()) {
    return Boolean(
      status && status.type !== 'offRoad' && status.type !== 'postRoute'
    )
  }
}

/**
 * Fetches all mobile libraries from the API, optionally filtered by local authority ID.
 *
 * @param {number|string} [localAuthorityId] - Optional local authority ID filter.
 * @returns {Promise<Mobile[]>} Array of Mobile instances.
 */
export async function getAllMobiles (localAuthorityId) {
  try {
    const path = localAuthorityId
      ? `/mobiles?local_authority_id=${localAuthorityId}`
      : '/mobiles'
    const response = await apiGet(path)
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(m => new Mobile().fromJson(m))
    }
  } catch (e) {}
  return []
}

/**
 * Fetches a single mobile library by its numeric ID.
 *
 * @param {number|string} id - Mobile library ID.
 * @returns {Promise<Mobile|null>} Mobile instance or null.
 */
export async function getMobileById (id) {
  try {
    const response = await apiGet(`/mobiles/${id}`)
    if (response && response.data) {
      return new Mobile().fromJson(response.data)
    }
  } catch (e) {}
  return null
}

/**
 * Fetches current locations for all mobile libraries from the API.
 *
 * @returns {Promise<MobileLocation[]>} Array of MobileLocation instances.
 */
export async function getMobileLocations () {
  try {
    const response = await apiGet('/mobiles/locations')
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(ml => new MobileLocation().fromJson(ml))
    }
  } catch (e) {}
  return []
}

/**
 * Fetches mobile libraries with stops within `distance` meters of `location`.
 *
 * @param {number[]} location - `[longitude, latitude]` coordinates.
 * @param {number} distance - Search radius in meters.
 * @returns {Promise<MobileNearestStop[]>} Matching nearest mobile stops.
 */
export async function getMobilesNearest (location, distance) {
  try {
    const response = await apiGet(
      `/mobiles/nearest?longitude=${location[0]}&latitude=${location[1]}&distance=${distance}`
    )
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(m => new MobileNearestStop().fromJson(m))
    }
  } catch (e) {}
  return []
}
