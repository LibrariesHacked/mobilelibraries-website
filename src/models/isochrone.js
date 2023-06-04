import axios from 'axios'

const config = require('../helpers/config.json')

export class Isochrone {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json, transport) {
    this.transport = transport
    this.geo = json
    this.display = true
    return this
  }
}

export async function getIsochrone (point, transport) {
  const settings = config.travel.filter(n => n.name === transport)[0]
  const url =
    config.isochroneApi +
    transport +
    '?longitude=' +
    point[0] +
    '&latitude=' +
    point[1] +
    '&interval=' +
    settings.interval +
    '&duration=' +
    settings.duration

  const response = await axios.get(url)
  if (response && response.data) {
    return new Isochrone().fromJson(response.data, transport)
  } else {
    return null
  }
}
