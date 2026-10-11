import axios from 'axios'

import config from '../helpers/config.json'
import { metersToMiles } from '../helpers/utils'

/**
 * Represents a trip leg between two mobile library stops.
 */
export class Trip {
  /**
   * @param {Partial<Trip>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw trip JSON from the API.
   * @returns {Trip} This instance.
   */
  fromJson (json) {
    this.id = json.id
    this.originStopId = json.origin_stop_id
    this.originStopName = json.origin_stop_name
    this.destinationStopId = json.destination_stop_id
    this.destinationStopName = json.destination_stop_name
    this.distance = json.distance
    this.duration = json.duration
    this.routeLine = json.route_line
    return this
  }

  /**
   * Display title for the trip leg (`"<Origin> to <Destination>"`).
   *
   * @returns {string} Trip title.
   */
  get title () {
    return this.originStopName && this.destinationStopName
      ? `${this.originStopName} to ${this.destinationStopName}`
      : 'Mobile trip details'
  }

  /**
   * Formatted estimated duration in minutes.
   *
   * @returns {string} Duration string (e.g. `"12 minutes"`).
   */
  get estimatedDuration () {
    return Math.round((this.duration || 0) / 60) + ' minutes'
  }

  /**
   * Formatted trip length in miles.
   *
   * @returns {string} Distance string (e.g. `"4 mile(s)"`).
   */
  get distanceInMiles () {
    return metersToMiles(this.distance) + ' mile(s)'
  }
}

/**
 * Fetches all trips from the API.
 *
 * @returns {Promise<Trip[]>} Array of Trip instances.
 */
export async function getAllTrips () {
  const response = await axios.get(config.api + '/trips')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(t => new Trip().fromJson(t))
  } else {
    return []
  }
}

/**
 * Fetches a single trip by its ID.
 *
 * @param {string|number} id - Trip ID.
 * @returns {Promise<Trip|object>} Trip instance or empty object.
 */
export async function getTripById (id) {
  const response = await axios.get(config.api + '/trips/' + id)
  if (response && response.data) {
    return new Trip().fromJson(response.data)
  } else {
    return {}
  }
}
