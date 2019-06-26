// Axios for making requests
import axios from 'axios';

const config = require('./config.json');

export function getQueryStops(query, organisation_filters, mobile_filters, route_filters, callback) {

	let url = config.api + '/api/stops?page=' + (query.page + 1) + '&limit=' + query.pageSize;
	if (query.orderBy && query.orderBy.field) url = url + '&sort=' + query.orderBy.field + '&direction=' + query.orderDirection;

	if (mobile_filters.length > 0) url = url + '&mobile_ids=' + mobile_filters.join('|');
	if (organisation_filters.length > 0) url = url + '&organisation_ids=' + organisation_filters.join('|');
	if (route_filters.length > 0) url = url + '&route_ids=' + route_filters.join('|');

	axios.get(url)
		.then(response => {
			if (response && response.data) {
				callback({
					stops: response.data,
					total: parseInt(response.headers['x-total-count']),
					page: parseInt(response.headers['x-page'])
				});
			} else {
				callback({ stops: [], total: 0, page: 1 });
			}
		})
		.catch(err => callback({ stops: [], total: 0, page: 1 }));
}

export function getAllStops(callback) {
	axios.get(config.api + '/api/stops')
		.then(response => {
			if (response && response.data) {
				callback(response.data);
			} else {
				callback({});
			}
		})
		.catch(err => callback({}));
}