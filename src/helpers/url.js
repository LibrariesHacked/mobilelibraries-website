export const addService = (navigate, systemName) => {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.set('service', systemName)
  navigate(window.location.pathname + '?' + currentUrlParams.toString())
}

export const clearService = navigate => {
  const currentUrlParams = new URLSearchParams(window.location.search)
  currentUrlParams.delete('service')
  navigate(window.location.pathname)
}

export const getDomainFromUrl = url => {
  const domain = new URL(url).hostname
  return domain
}
