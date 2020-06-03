import axios from 'axios'
import moment from 'moment'

const config = require('./config.json')

export class Mobile {
  constructor (json) {
    this.id = json.id
    this.organisationId = json.organisation_id
    this.name = json.name
    this.timetable = json.timetable
    this.numberRoutes = json.number_routes
    this.numberStops = json.number_stops
  }
}

export class MobileLocation {
  constructor (json) {
    this.mobileId = json.mobile_id
    this.currentStopId = json.current_stop_id
    this.currentStopDeparture = moment(json.current_stop_departure)
    this.currentStopName = json.current_stop_name
    this.previousStopId = json.previous_stop_id
    this.previousStopDeparture = moment(json.previous_stop_departure)
    this.previousStopName = json.previous_stop_name
    this.nextStopId = json.next_stop_id
    this.nextStopArrival = moment(json.next_stop_arrival)
    this.nextStopName = json.next_stop_name
    this.updated = moment(json.updated)
    this.updateType = json.update_type
    this.geoX = json.geox
    this.geoY = json.geoy
    this.routeSection = json.route_section
  }

  getStatus () {
    const now = moment()
    const statuses = {
      offRoad: 'Not out today',
      preRoute: 'Arriving at ',
      atStop: 'At ',
      betweenStops: 'Arriving at ',
      postRoute: 'Finished for the day'
    }
    // The mobile is not due out today
    if (!this.currentStopId && !this.previousStopId && this.nextStopId && !this.nextStopArrival.isSame(now, 'day')) {
      return {
        type: 'off_road',
        textFormat: statuses.offRoad,
        message: statuses.offRoad
      }
    }
    // The mobile is due out today
    if (!this.currentStopId && !this.previousStopId && this.nextStopId && this.nextStopArrival.isSame(now, 'day')) {
      const arrival = this.nextStopArrival.fromNow()
      return {
        type: 'pre_route',
        message: statuses.preRoute,
        textFormat: statuses.preRoute + this.nextStopName + ' ' + arrival,
        args: [
          { stopName: this.nextStopName, stopId: this.nextStopId },
          arrival
        ]
      }
    }
    // The mobile is at a stop, and will be for a certain amount of time
    if (this.currentStopId) {
      const stopRemaining = this.currentStopDeparture.fromNow(true)
      return {
        type: 'atStop',
        message: statuses.atStop,
        textFormat: statuses.atStop + this.currentStopName + ' for ' + stopRemaining,
        args: [
          { stopName: this.currentStopName, stopId: this.currentStopId },
          stopRemaining
        ]
      }
    }
    // The mobile is between stops
    if (!this.currentStopId && this.previousStopId && this.nextStopId && this.previousStopDeparture.isSame(now, 'day') && this.nextStopArrival.isSame(now, 'day')) {
      const arrival = this.nextStopArrival.fromNow()
      return {
        type: 'between_stops',
        message: statuses.betweenStops,
        textFormat: statuses.betweenStops + this.nextStopName + ' ' + arrival,
        args: [
          { stopName: this.nextStopName, stopId: this.nextStopId },
          arrival
        ]
      }
    }
    // The mobile has finished for the day
    if (this.previousStopId && this.nextStopId && this.previousStopDeparture.isSame(now, 'day') && !this.nextStopArrival.isSame(now, 'day')) {
      return {
        type: 'post_route',
        message: statuses.postRoute,
        text_format: statuses.postRoute
      }
    }
    return null
  }
}

export async function getAllMobiles () {
  const response = await axios.get(config.api + '/mobiles')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(m => new Mobile(m))
  } else {
    return []
  }
}

export async function getMobileLocations () {
  const response = axios.get(config.api + '/mobiles/locations')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(ml => new MobileLocation(ml))
  } else {
    return []
  }
}

export function getMobilesNearest (location, distance) {
  const response = axios.get(config.api + '/mobiles/nearest?longitude=' + location[0] + '&latitude=' + location[1] + '&distance=' + distance)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(m => new Mobile(m))
  } else {
    return []
  }
}
