import axios from 'axios'

const config = require('./config.json')

export class Trip {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.id = json.id
    this.originStopId = json.origin_stop_id
    this.originStopName = json.origin_stop_name
    this.destinationStopId = json.destination_stop_id
    this.destinationStopName = json.destination_stop_name
    this.distance = json.distance
    this.duration = json.duration
    this.routeLine = json.route_line
    return this
  }
}

export async function getAllTrips () {
  const response = await axios.get(config.api + '/trips')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(t => (new Trip()).fromJson(t))
  } else {
    return []
  }
}

export async function getTripById (id) {
  const response = await axios.get(config.api + '/trips/' + id)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(t => (new Trip()).fromJson(t))
  } else {
    return []
  }
}
