import axios from 'axios'
import config from './config.json'

const LOCAL_FALLBACK_API = 'http://localhost:8080/api'

/**
 * Opens a URL in a new browser tab with `noopener,noreferrer`.
 *
 * @param {string} url - Target URL to open.
 */
export const openUrl = url => {
  if (!url) return
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

/**
 * Performs a GET request against the configured Mobile Libraries API,
 * falling back to `http://localhost:8080/api` during local development
 * if the remote production endpoint is temporarily unavailable (5xx / network error).
 *
 * @param {string} path - API path starting with `/` (e.g. `'/localauthorities'`).
 * @returns {Promise<import('axios').AxiosResponse>} Axios response.
 */
export const apiGet = async path => {
  try {
    return await axios.get(`${config.api}${path}`)
  } catch (err) {
    const isLocalDev =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
    const status = err?.response?.status
    if (isLocalDev && (!status || status >= 500)) {
      return await axios.get(`${LOCAL_FALLBACK_API}${path}`)
    }
    throw err
  }
}
