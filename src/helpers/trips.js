// Axios for making requests
import axios from 'axios'

const config = require('./config.json')

export function getAllTrips (callback) {
  axios.get(config.api + '/trips')
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback([])
      }
    })
    .catch(() => callback([]))
}

export function getTripById (id, callback) {
  axios.get(config.api + '/trips/' + id)
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback({})
      }
    })
    .catch(() => callback({}))
}
