// Axios for making requests
import axios from 'axios'

// Moment for time calculations
import moment from 'moment'

const config = require('./config.json')

export function getAllMobiles (callback) {
  axios.get(config.api + '/mobiles')
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback([])
      }
    })
    .catch(() => callback([]))
}

export function getMobileLocations (callback) {
  axios.get(config.api + '/mobiles/locations')
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback([])
      }
    })
    .catch(err => callback([]))
}

export function getMobilesNearest (location, distance, callback) {
  axios.get(config.api + '/mobiles/nearest?longitude=' + location[0] + '&latitude=' + location[1] + '&distance=' + distance)
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback([])
      }
    })
    .catch(() => callback([]))
}

export function getMobileStatus (location) {
  const statuses = {
    off_road: {
      label: 'Not out today'
    },
    pre_route: {
      label: 'Arriving at '
    },
    at_stop: {
      label: 'At '
    },
    between_stops: {
      label: 'Arriving at '
    },
    post_route: {
      label: 'Finished for the day'
    }
  }

  // The mobile is not due out today
  if (location && !location.currentStop_id &&
    !location.previous_stop_id && location.next_stop_id &&
    !moment(location.next_stop_arrival).isSame(moment(), 'day')) {
    return {
      type: 'off_road',
      text_format: statuses.off_road.label,
      message: statuses.off_road.label
    }
  }

  // The mobile is due out today
  if (location && !location.currentStop_id &&
    !location.previous_stop_id && location.next_stop_id &&
    moment(location.next_stop_arrival).isSame(moment(), 'day')) {
    const arrival = moment(location.next_stop_arrival).fromNow()
    return {
      type: 'pre_route',
      message: statuses.pre_route.label,
      text_format: statuses.pre_route.label + location.next_stop_name + ' ' + arrival,
      args: [
        { stop_name: location.next_stop_name, stop_id: location.next_stop_id },
        arrival
      ]
    }
  }

  // The mobile is at a stop, and will be for a certain amount of time
  if (location && location.currentStop_id) {
    const stopRemaining = moment(location.currentStop_departure).fromNow(true)
    return {
      type: 'at_stop',
      message: statuses.at_stop.label,
      text_format: statuses.at_stop.label + location.currentStop_name + ' for ' + stopRemaining,
      args: [
        { stop_name: location.currentStop_name, stop_id: location.currentStop_id },
        stopRemaining
      ]
    }
  }

  // The mobile is between stops
  if (location && !location.currentStop_id &&
    location.previous_stop_id && location.next_stop_id &&
    moment(location.previous_stop_departure).isSame(moment(), 'day') &&
    moment(location.next_stop_arrival).isSame(moment(), 'day')) {
    const arrival = moment(location.next_stop_arrival).fromNow()
    return {
      type: 'between_stops',
      message: statuses.between_stops.label,
      text_format: statuses.between_stops.label + location.next_stop_name + ' ' + arrival,
      args: [
        { stop_name: location.next_stop_name, stop_id: location.next_stop_id },
        arrival
      ]
    }
  }

  // The mobile has finished for the day
  if (location &&
    location.previous_stop_id && location.next_stop_id &&
    moment(location.previous_stop_departure).isSame(moment(), 'day') &&
    !moment(location.next_stop_arrival).isSame(moment(), 'day')) {
    return {
      type: 'post_route',
      message: statuses.post_route.label,
      text_format: statuses.post_route.label
    }
  }

  return null
}
