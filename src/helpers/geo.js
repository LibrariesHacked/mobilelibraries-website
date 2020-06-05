import axios from 'axios'

const config = require('./config.json')

export function getPosition (options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export async function getCurrentPosition () {
  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  }

  const position = await getPosition(options)
  return [position.coords.longitude, position.coords.latitude]
}

export async function getPostcode (postcode) {
  const response = await axios.get(config.postcodeApi + postcode)
  return {
    location: [response.data.longitude, response.data.latitude],
    organisation: response.data.library_service_name
  }
};
