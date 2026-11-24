import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import config from '../helpers/config.json'

dayjs.extend(relativeTime)

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
    this.currentStopDeparture = json.current_stop_departure
      ? dayjs(json.current_stop_departure)
      : null
    this.currentStopName = json.current_stop_name
    this.previousStopId = json.previous_stop_id
    this.previousStopDeparture = json.previous_stop_departure
      ? dayjs(json.previous_stop_departure)
      : null
    this.previousStopName = json.previous_stop_name
    this.nextStopId = json.next_stop_id
    this.nextStopArrival = json.next_stop_arrival
      ? dayjs(json.next_stop_arrival)
      : null
    this.nextStopName = json.next_stop_name
    this.updated = json.updated ? dayjs(json.updated) : null
    this.updateType = json.update_type
    this.geoX = json.geox != null ? Number(json.geox) : null
    this.geoY = json.geoy != null ? Number(json.geoy) : null
    this.routeSection = json.route_section
    return this
  }

  /**
   * Interpolates the mobile library's current `[longitude, latitude]` coordinates
   * along its active `routeSection` if available.
   *
   * @param {dayjs.Dayjs} [now=dayjs()] - Reference timestamp.
   * @returns {number[]|null} `[longitude, latitude]` coordinates or `null` if unavailable.
   */
  getCoordinates (now = dayjs()) {
    if (this.geoX == null || this.geoY == null) return null
    let locationPoint = [this.geoX, this.geoY]
    if (this.routeSection && this.routeSection.coordinates && this.updated) {
      const millisecondsPassed = now.diff(this.updated)
      const index = Math.round(millisecondsPassed / 500)
      const coords = this.routeSection.coordinates
      if (coords.length > index && index > 0) {
        locationPoint = coords[index]
      }
      if (coords.length <= index && index > 0) {
        locationPoint = coords[coords.length - 1]
      }
    }
    return locationPoint
  }

  /**
   * Computes the current operational status of the mobile library.
   *
   * @returns {{
   *   type: 'offRoad'|'preRoute'|'atStop'|'betweenStops'|'postRoute',
   *   message: string,
   *   textFormat: string,
   *   args?: Array<any>
   * }|null} Status object or `null`.
   */
  getStatus () {
    const now = dayjs()
    const statuses = {
      offRoad: 'Not out today',
      preRoute: 'Arriving at ',
      atStop: 'At ',
      betweenStops: 'Arriving at ',
      postRoute: 'Finished for the day'
    }
    // The mobile is not due out today
    if (
      !this.currentStopId &&
      !this.previousStopId &&
      this.nextStopId &&
      this.nextStopArrival &&
      !this.nextStopArrival.isSame(now, 'day')
    ) {
      return {
        type: 'offRoad',
        textFormat: statuses.offRoad,
        message: statuses.offRoad
      }
    }
    // The mobile is due out today
    if (
      !this.currentStopId &&
      !this.previousStopId &&
      this.nextStopId &&
      this.nextStopArrival &&
      this.nextStopArrival.isSame(now, 'day')
    ) {
      const arrival = this.nextStopArrival.fromNow()
      return {
        type: 'preRoute',
        message: statuses.preRoute,
        textFormat: statuses.preRoute + this.nextStopName + ' ' + arrival,
        args: [
          { stopName: this.nextStopName, stopId: this.nextStopId },
          arrival
        ]
      }
    }
    // The mobile is at a stop, and will be for a certain amount of time
    if (this.currentStopId && this.currentStopDeparture) {
      const stopRemaining = this.currentStopDeparture.fromNow(true)
      return {
        type: 'atStop',
        message: statuses.atStop,
        textFormat:
          statuses.atStop + this.currentStopName + ' for ' + stopRemaining,
        args: [
          { stopName: this.currentStopName, stopId: this.currentStopId },
          stopRemaining
        ]
      }
    }
    // The mobile is between stops
    if (
      !this.currentStopId &&
      this.previousStopId &&
      this.nextStopId &&
      this.previousStopDeparture &&
      this.nextStopArrival &&
      this.previousStopDeparture.isSame(now, 'day') &&
      this.nextStopArrival.isSame(now, 'day')
    ) {
      const arrival = this.nextStopArrival.fromNow()
      return {
        type: 'betweenStops',
        message: statuses.betweenStops,
        textFormat: statuses.betweenStops + this.nextStopName + ' ' + arrival,
        args: [
          { stopName: this.nextStopName, stopId: this.nextStopId },
          arrival
        ]
      }
    }
    // The mobile has finished for the day
    if (
      this.previousStopId &&
      this.nextStopId &&
      this.previousStopDeparture &&
      this.nextStopArrival &&
      this.previousStopDeparture.isSame(now, 'day') &&
      !this.nextStopArrival.isSame(now, 'day')
    ) {
      return {
        type: 'postRoute',
        message: statuses.postRoute,
        textFormat: statuses.postRoute
      }
    }
    return null
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
    const url = localAuthorityId
      ? `${config.api}/mobiles?local_authority_id=${localAuthorityId}`
      : `${config.api}/mobiles`
    const response = await axios.get(url)
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
    const response = await axios.get(`${config.api}/mobiles/${id}`)
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
    const response = await axios.get(config.api + '/mobiles/locations')
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
    const response = await axios.get(
      config.api +
        '/mobiles/nearest?longitude=' +
        location[0] +
        '&latitude=' +
        location[1] +
        '&distance=' +
        distance
    )
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(m => new MobileNearestStop().fromJson(m))
    }
  } catch (e) {}
  return []
}
