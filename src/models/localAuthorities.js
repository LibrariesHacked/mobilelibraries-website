import axios from 'axios'

import config from '../helpers/config.json'
import { hextoRGBA } from '../helpers/utils'
import theme from '../theme'

/**
 * Represents a local library authority that operates mobile libraries.
 */
export class LocalAuthority {
  /**
   * @param {Partial<LocalAuthority>} [obj] - Optional initial properties.
   */
  constructor (obj) {
    Object.assign(this, obj)
  }

  /**
   * Populates the instance from an API JSON payload.
   *
   * @param {object} json - Raw local authority JSON from the API.
   * @returns {LocalAuthority} This instance.
   */
  fromJson (json) {
    this.id = json.id
    this.country = json.country
    this.code = json.local_authority_code
    this.localAuthorityCode = json.local_authority_code
    this.name = json.name
    this.timetable = json.timetable
    this.website = json.website
    this.email = json.email
    this.colour = json.colour
    this.logo = json.logo
    this.numberMobiles = Number(json.number_mobiles) || 0
    this.numberRoutes = Number(json.number_routes) || 0
    this.numberStops = Number(json.number_stops) || 0
    return this
  }

  /**
   * Returns the local authority's brand colour as an `rgba(...)` CSS string.
   *
   * @param {number} [alpha=0.8] - Opacity value between 0 and 1.
   * @returns {string} CSS `rgba(...)` colour string.
   */
  getRgbaColour (alpha = 0.8) {
    return hextoRGBA(this.colour || theme.palette.primary.main, alpha)
  }
}

/**
 * Fetches all local library authorities from the API.
 *
 * @returns {Promise<LocalAuthority[]>} Array of LocalAuthority instances.
 */
export async function getAllLocalAuthorities () {
  try {
    const response = await axios.get(config.api + '/localauthorities')
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map(la => new LocalAuthority().fromJson(la))
    }
  } catch (e) {}
  return []
}

/**
 * Fetches a single local library authority by numeric ID or 9-character GSS code.
 *
 * @param {string|number} id - Numeric database ID or 9-character GSS code.
 * @returns {Promise<LocalAuthority|null>} LocalAuthority instance or null if not found.
 */
export async function getLocalAuthorityById (id) {
  try {
    const response = await axios.get(`${config.api}/localauthorities/${id}`)
    if (response && response.data) {
      return new LocalAuthority().fromJson(response.data)
    }
  } catch (e) {}
  return null
}
