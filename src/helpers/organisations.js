// Axios for making requests
import axios from 'axios'

const config = require('./config.json')

export function getAllOrganisations (callback) {
  axios.get(config.api + '/organisations')
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback([])
      }
    })
    .catch(() => callback([]))
}
