// Axios for making requests
import axios from 'axios';

const config = require('./config.json');

export function getQueryStops(query, callback) {
	let url = config.api + '/api/stops?page=' + (query.page + 1) + '&limit=' + query.pageSize;
	if (query.orderBy && query.orderBy.field) url = url + '&sort=' + query.orderBy.field + '&direction=' + query.orderDirection;
	axios.get(url)
		.then(response => {
			if (response && response.data) {
				callback({
					stops: response.data,
					total: parseInt(response.headers['x-total-count']),
					page: parseInt(response.headers['x-page'])
				});
			} else {
				callback({});
			}
		})
		.catch(err => callback({}));
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