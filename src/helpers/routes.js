import axios from 'axios'
import moment from 'moment'

const config = require('./config.json')

export class Route {
  constructor (json) {
    this.id = json.id
    this.organisationId = json.organisation_id
    this.mobileId = json.mobile_id
    this.name = json.name
    this.frequency = json.frequency
    this.start = moment(json.start)
    this.end = moment(json.end)
    this.timetable = json.timetable
    this.numberStops = json.number_stops
  }
}

export async function getAllRoutes () {
  const response = await axios.get(config.api + '/routes')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(r => new Route(r))
  } else {
    return []
  }
}
