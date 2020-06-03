import axios from 'axios'

const config = require('./config.json')

export class Organisation {
  constructor (json) {
    this.id = json.id
    this.country = json.country
    this.code = json.code
    this.name = json.name
    this.timetable = json.timetable
    this.website = json.website
    this.email = json.email
    this.colour = json.colour
    this.logo = json.logo
    this.numberMobiles = json.number_mobiles
    this.numberRoutes = json.number_routes
    this.numberStops = json.number_stops
  }
}

export async function getAllOrganisations () {
  const response = await axios.get(config.api + '/organisations')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(o => new Organisation(o))
  } else {
    return []
  }
}
