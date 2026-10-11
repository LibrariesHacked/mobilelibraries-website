import axios from 'axios'

import config from './config.json'

/**
 * Wraps `navigator.geolocation.getCurrentPosition` in a Promise.
 *
 * @param {PositionOptions} [options={}] - Geolocation options.
 * @returns {Promise<GeolocationPosition>} Resolved geolocation position.
 */
export const getPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

/**
 * Retrieves the user's current `[longitude, latitude]` coordinates via browser GPS.
 *
 * @returns {Promise<number[]>} Tuple of `[longitude, latitude]`.
 */
export const getCurrentPosition = async () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }

  const position = await getPosition(options)
  return [position.coords.longitude, position.coords.latitude]
}

/**
 * Reverse-geocodes `[longitude, latitude]` coordinates to the nearest UK postcode.
 *
 * @param {number} lon - Longitude.
 * @param {number} lat - Latitude.
 * @returns {Promise<string|undefined>} Nearest postcode string if found.
 */
export const getCurrentPostcode = async (lon, lat) => {
  const uri = `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}`
  try {
    const res = await axios.get(uri)
    if (res.status === 200) {
      const postcodes = res.data.result
      if (postcodes && postcodes.length > 0) {
        return postcodes[0].postcode
      }
    }
  } catch (e) {}
}

/**
 * Looks up coordinates and library authority metadata for a UK postcode.
 *
 * @param {string} postcode - UK postcode to look up.
 * @returns {Promise<{location: number[], library_service_name: string, library_service: string}>} Postcode lookup result.
 */
export const getPostcode = async postcode => {
  const response = await axios.get(config.postcodeApi + postcode)
  return {
    location: [response.data.longitude, response.data.latitude],
    library_service_name: response.data.library_service_name,
    library_service: response.data.library_service
  }
}

/**
 * Resolves a postcode to its matching library service and coordinates.
 *
 * @param {string} postcode - UK postcode string.
 * @param {Array<{code: string}>} services - Available library services.
 * @returns {Promise<{service?: object, location?: number[]}>} Matched service and location.
 */
export const getServiceDataFromPostcode = async (postcode, services) => {
  const postcodeData = await getPostcode(postcode)
  const servicesFiltered = services.filter(
    s => s.code === postcodeData.library_service
  )
  if (servicesFiltered.length > 0) {
    return { service: servicesFiltered[0], location: postcodeData.location }
  }
  return {}
}

/**
 * Validates whether a string matches standard UK postcode format.
 *
 * @param {string} postcode - Postcode string to validate.
 * @returns {boolean} True if valid UK postcode format.
 */
export const validatePostcode = postcode => {
  if (!postcode) return false
  return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode.trim())
}
