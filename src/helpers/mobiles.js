// Axios for making requests
import axios from 'axios';

// Moment for time calculations
import moment from 'moment';

const config = require('./config.json');

export function getAllMobiles(callback) {
	axios.get(config.api + '/api/mobiles')
		.then(response => {
			if (response && response.data) {
				callback(response.data);
			} else {
				callback([]);
			}
		})
		.catch(err => callback([]));
}

export function getMobileLocations(callback) {
	axios.get(config.api + '/api/mobiles/locations')
		.then(response => {
			if (response && response.data) {
				callback(response.data);
			} else {
				callback([]);
			}
		})
		.catch(err => callback([]));
}

export function getMobileStatus(mobile, location) {

	const statuses = {
		off_road: {
			label: "Off Road"
		},
		at_stop: {
			label: "At {0} for {1}"
		}
	}

	// The mobile is at a stop, and will be for a certain amount of time
	if (location && location.current_stop_id) {
		return statuses.at_stop.format(location.current_stop_name, moment(location.current_stop_departure).fromNow());
	}

	// The mobile is between stops
	if (location && !location.current_stop_id && location.previous_stop_id && location.next_stop_id) {
		return statuses.at_stop.format(location.current_stop_name);

	}
	

	return statuses.off_road;
}