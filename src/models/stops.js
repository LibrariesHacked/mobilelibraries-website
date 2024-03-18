import axios from 'axios'
import moment from 'moment'

import { getText } from '../helpers/rrule'

import config from '../helpers/config.json'

export class Stop {
  constructor (obj) {
    Object.assign(this, obj)
  }

  fromJson (json) {
    this.id = json.id
    this.routeIds = json.route_ids
    this.routeNames = json.route_names
    this.mobileIds = json.mobile_ids
    this.mobileNames = json.mobile_names
    this.organisationId = json.organisation_id
    this.organisationName = json.organisation_name
    this.name = json.name
    this.community = json.community
    this.address = json.address
    this.postcode = json.postcode
    this.arrivalTimes = json.arrival_times
    this.departureTimes = json.departure_times
    this.routeStart = moment(json.route_start)
    this.routeEnd = moment(json.route_end)
    this.routeDays = json.route_days
    this.routeFrequencies = json.route_frequencies
    this.routeFrequencyDescriptions = json.route_frequencies.map(f =>
      getText(f)
    )
    this.routeSchedule = json.route_schedule.map(s => moment(s))
    this.timetable = json.timetable
    this.longitude = json.longitude
    this.latitude = json.latitude
    this.distance = json.distance
    return this
  }
}

export async function getQueryStops (
  query,
  searchPosition,
  distance,
  organisationFilter,
  mobileFilter,
  routeFilter
) {
  let url = `${config.api}/stops?page=${query.page + 1}&limit=${query.pageSize}`

  if (query.orderBy && query.orderBy.field) {
    url = `${url}&sort=${query.orderBy.field}&direction=${query.orderBy.direction}`
  }

  if (searchPosition && searchPosition.length > 1) {
    url = `${url}&longitude=${searchPosition[0]}&latitude=${searchPosition[1]}`
  }

  if (distance && distance !== '') url = `${url}&distance=${distance}`

  if (organisationFilter.length > 0) {
    url = `${url}&organisation_ids=${organisationFilter.join('|')}`
  }

  if (mobileFilter.length > 0) {
    url = `${url}&mobile_ids=${mobileFilter.join('|')}`
  }

  if (routeFilter.length > 0) {
    url = `${url}&route_ids=${routeFilter.join('|')}`
  }

  const response = await axios.get(url)
  if (response && response.data && response.data.length > 0) {
    return {
      stops: response.data.map(s => new Stop().fromJson(s)),
      totalRowCount: parseInt(response.headers['x-total-count']),
      currentPage: parseInt(response.headers['x-page'])
    }
  } else {
    return { stops: [], totalRowCount: 0, currentPage: 1 }
  }
}

export async function getAllStops () {
  const response = await axios.get(`${config.api}/stops`)
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => new Stop().fromJson(s))
  } else {
    return []
  }
}

export async function getStopById (id) {
  const response = await axios.get(`${config.api}/stops/${id}`)
  if (response && response.data) {
    return new Stop().fromJson(response.data)
  } else {
    return {}
  }
}
