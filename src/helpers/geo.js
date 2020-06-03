import axios from 'axios'

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
  const response = await axios.get('https://api.postcodes.io/postcodes/' + postcode)
  return {
    location: [response.data.result.longitude, response.data.result.latitude],
    admin_district: response.data.result.admin_district
  }
};
