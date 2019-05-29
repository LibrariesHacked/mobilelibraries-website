// Axios for making requests
import axios from 'axios';

const config = require('./config.json');

export function getQueryStops(query, callback) {

	let organisation_filters = [];
	let mobile_filters = [];
	let route_filters = [];

	// We can either filter by organisation_id or mobile_id, or route id
	if (query.filters && query.filters.length > 0) {
		query.filters.forEach(filter => {
			if (filter.column.field === 'organisation_id') organisation_filters = filter.value;
			if (filter.column.field === 'mobile_id') mobile_filters = filter.value;
			if (filter.column.field === 'route_id') route_filters = filter.value;
		});
	}

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

// getAllStops: 
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