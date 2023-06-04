import axios from 'axios'

const config = require('./config.json')

export const getPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export const getCurrentPosition = async () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }

  const position = await getPosition(options)
  return [position.coords.longitude, position.coords.latitude]
}

export const getCurrentPostcode = async (lon, lat) => {
  const uri = `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}`
  try {
    const res = await axios.get(uri)
    if (res.status === 200) {
      const postcodes = res.data.result
      if (postcodes.length > 0) {
        return postcodes[0].postcode
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export const getPostcode = async postcode => {
  const response = await axios.get(config.postcodeApi + postcode)
  return {
    location: [response.data.longitude, response.data.latitude],
    library_service_name: response.data.library_service_name,
    library_service: response.data.library_service
  }
}

export const getServiceDataFromPostcode = async (postcode, services) => {
  const postcodeData = await getPostcode(postcode)
  const servicesFiltered = services.filter(
    s => s.code === postcodeData.library_service
  )
  if (servicesFiltered.length > 0)
    return { service: servicesFiltered[0], location: postcodeData.location }
  return {}
}

export const getNearestLibrary = async location => {
  const response = await axios.get(
    config.libraryApi + '?latitude=' + location[1] + '&longitude=' + location[0]
  )
  return response && response.data && response.data.length > 0
    ? response.data[0]
    : null
}

export const getNearestMobileLibrary = async location => {
  const response = await axios.get(
    config.mobileLibraryApi +
      '?latitude=' +
      location[1] +
      '&longitude=' +
      location[0]
  )
  return response && response.data && response.data.length > 0
    ? response.data[0]
    : null
}

export const validatePostcode = postcode => {
  return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(postcode.trim())
}
