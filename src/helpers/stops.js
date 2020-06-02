// Axios for making requests
import axios from 'axios'

const config = require('./config.json')

export function getQueryStops (query, organisationFilters, mobileFilters, routeFilters, currentPosition, distance, callback) {
  let url = config.api + '/stops?page=' + (query.page + 1) + '&limit=' + query.pageSize
  if (query.orderBy && query.orderBy.field) url = url + '&sort=' + query.orderBy.field + '&direction=' + query.orderDirection

  if (mobileFilters.length > 0) url = url + '&mobileIds=' + mobileFilters.join('|')
  if (organisationFilters.length > 0) url = url + '&organisationIds=' + organisationFilters.join('|')
  if (routeFilters.length > 0) url = url + '&routeIds=' + routeFilters.join('|')

  if (currentPosition && currentPosition.length > 1) url = url + '&longitude=' + currentPosition[0] + '&latitude=' + currentPosition[1]
  if (distance && distance !== '') url = url + '&distance=' + distance

  axios.get(url)
    .then(response => {
      if (response && response.data) {
        callback({
          stops: response.data,
          total: parseInt(response.headers['x-total-count']),
          page: parseInt(response.headers['x-page'])
        })
      } else {
        callback({ stops: [], total: 0, page: 1 })
      }
    })
    .catch(() => callback({ stops: [], total: 0, page: 1 }))
}

export function getAllStops (callback) {
  axios.get(config.api + '/stops')
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback({})
      }
    })
    .catch(() => callback({}))
}

export function getStopById (id, callback) {
  axios.get(config.api + '/stops/' + id)
    .then(response => {
      if (response && response.data) {
        callback(response.data)
      } else {
        callback({})
      }
    })
    .catch(() => callback({}))
}
