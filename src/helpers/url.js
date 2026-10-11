/**
 * Adds or updates the `service` query parameter in the URL.
 *
 * @param {Function} navigate - React Router navigate function.
 * @param {string} systemName - Library service code or identifier.
 */
export const addService = (navigate, systemName) => {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.set('service', systemName)
  navigate(window.location.pathname + '?' + currentUrlParams.toString())
}

/**
 * Removes the `service` query parameter from the current URL.
 *
 * @param {Function} navigate - React Router navigate function.
 */
export const clearService = navigate => {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.delete('service')
  navigate(window.location.pathname)
}

/**
 * Extracts the hostname from a URL string safely.
 *
 * @param {string} url - Full URL string.
 * @returns {string} Hostname of the URL, or an empty string if invalid.
 */
export const getDomainFromUrl = url => {
  if (!url) return ''
  try {
    return new URL(url).hostname
  } catch (e) {
    return url
  }
}

/**
 * Opens a URL in a new browser tab or specified target window.
 *
 * @param {string} url - Destination URL.
 * @param {string} [target='_blank'] - Window target name.
 */
export const openUrl = (url, target = '_blank') => {
  if (url) {
    window.open(url, target)
  }
}
