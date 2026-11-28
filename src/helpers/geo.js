import axios from 'axios'

import config from './config.json'

/**
 * Retrieves the user's current `[longitude, latitude]` coordinates via browser GPS.
 *
 * @returns {Promise<number[]>} Tuple of `[longitude, latitude]`.
 */
export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve([pos.coords.longitude, pos.coords.latitude]),
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  })

/**
 * Reverse-geocodes `[longitude, latitude]` coordinates to the nearest UK postcode.
 *
 * @param {number} lon - Longitude.
 * @param {number} lat - Latitude.
 * @returns {Promise<string|undefined>} Nearest postcode string if found.
 */
export const getCurrentPostcode = async (lon, lat) => {
  try {
    const res = await axios.get(
      `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}`
    )
    return res.data?.result?.[0]?.postcode
  } catch (e) {}
}

/**
 * Looks up coordinates and library authority metadata for a UK postcode.
 *
 * @param {string} postcode - UK postcode to look up.
 * @returns {Promise<{location: number[], library_service_name: string, library_service: string}>} Postcode lookup result.
 */
export const getPostcode = async postcode => {
  const { data } = await axios.get(config.postcodeApi + postcode)
  return {
    location: [Number(data.longitude), Number(data.latitude)],
    library_service_name: data.library_service_name,
    library_service: data.library_service
  }
}

/**
 * Creates a MapLibre bounds tuple from a collection of `[longitude, latitude]` coordinates.
 *
 * @param {number[][]} coordinates - Coordinate pairs.
 * @returns {number[][]|null} `[[west, south], [east, north]]` bounds, or `null` if empty.
 */
export const getCoordinateBounds = coordinates => {
  const validCoordinates = (coordinates || []).filter(
    pair =>
      Array.isArray(pair) &&
      Number.isFinite(pair[0]) &&
      Number.isFinite(pair[1])
  )
  if (validCoordinates.length === 0) return null

  return validCoordinates.reduce(
    (bounds, [longitude, latitude]) => [
      [
        Math.min(bounds[0][0], longitude),
        Math.min(bounds[0][1], latitude)
      ],
      [
        Math.max(bounds[1][0], longitude),
        Math.max(bounds[1][1], latitude)
      ]
    ],
    [
      [Infinity, Infinity],
      [-Infinity, -Infinity]
    ]
  )
}

/**
 * Validates whether a string matches standard UK postcode format.
 *
 * @param {string} postcode - Postcode string to validate.
 * @returns {boolean} True if valid UK postcode format.
 */
export const validatePostcode = postcode => {
  if (!postcode) return false
  return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode.trim())
}
