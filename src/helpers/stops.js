import axios from 'axios'
import moment from 'moment'

const config = require('./config.json')

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
    this.routeSchedule = json.route_schedule.map(s => moment(s))
    this.timetable = json.timetable
    this.longitude = json.longitude
    this.latitude = json.latitude
    return this
  }
}

export async function getQueryStops (query, organisationFilters, mobileFilters, routeFilters, currentPosition, distance) {
  let url = config.api + '/stops?page=' + (query.page + 1) + '&limit=' + query.pageSize
  if (query.orderBy && query.orderBy.field) url = url + '&sort=' + query.orderBy.field + '&direction=' + query.orderDirection

  if (mobileFilters.length > 0) url = url + '&mobileIds=' + mobileFilters.join('|')
  if (organisationFilters.length > 0) url = url + '&organisationIds=' + organisationFilters.join('|')
  if (routeFilters.length > 0) url = url + '&routeIds=' + routeFilters.join('|')

  if (currentPosition && currentPosition.length > 1) url = url + '&longitude=' + currentPosition[0] + '&latitude=' + currentPosition[1]
  if (distance && distance !== '') url = url + '&distance=' + distance

  const response = await axios.get(url)
  if (response && response.data && response.data.length > 0) {
    return {
      stops: response.data.map(s => (new Stop()).fromJson(s)),
      total: parseInt(response.headers['x-total-count']),
      page: parseInt(response.headers['x-page'])
    }
  } else {
    return { stops: [], total: 0, page: 1 }
  }
}

export async function getAllStops () {
  const response = await axios.get(config.api + '/stops')
  if (response && response.data && response.data.length > 0) {
    return response.data.map(s => (new Stop()).fromJson(s))
  } else {
    return []
  }
}

export async function getStopById (id) {
  const response = await axios.get(config.api + '/stops/' + id)
  if (response && response.data && response.data.length > 0) {
    return (new Stop()).fromJson(response.data)
  } else {
    return []
  }
}
