import axios from 'axios'

import config from '../helpers/config.json'
import { hextoRGBA } from '../helpers/utils'
import theme from '../theme'

/**
 * Represents a library authority / organisation that operates mobile libraries.
 */
export class Organisation {
  /**
   * @param {Partial<Organisation>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw organisation JSON from the API.
   * @returns {Organisation} This instance.
   */
  fromJson (json) {
    this.id = json.id
    this.country = json.country
    this.code = json.service_code
    this.name = json.name
    this.timetable = json.timetable
    this.website = json.website
    this.email = json.email
    this.colour = json.colour
    this.logo = json.logo
    this.numberMobiles = json.number_mobiles
    this.numberRoutes = json.number_routes
    this.numberStops = json.number_stops
    return this
  }

  /**
   * Returns the organisation's brand colour as an `rgba(...)` CSS string.
   *
   * @param {number} [alpha=0.8] - Opacity value between 0 and 1.
   * @returns {string} CSS `rgba(...)` colour string.
   */
  getRgbaColour (alpha = 0.8) {
    return hextoRGBA(this.colour || theme.palette.primary.main, alpha)
  }
}

/**
 * Fetches all library organisations from the API.
 *
 * @returns {Promise<Organisation[]>} Array of Organisation instances.
 */
export async function getAllOrganisations () {
  const response = await axios.get(config.api + '/organisations')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(o => new Organisation().fromJson(o))
  } else {
    return []
  }
}
