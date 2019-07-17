// Axios for making requests
import axios from 'axios';

// Moment for time calculations
import moment from 'moment';

import util from 'util';

const config = require('./config.json');

export function getAllMobiles(callback) {
	axios.get(config.api + '/mobiles')
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
	axios.get(config.api + '/mobiles/locations')
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

	let statuses = {
		off_road: {
			label: "Not out today"
		},
		pre_route: {
			label: "Arriving at %s %s"
		},
		at_stop: {
			label: "At %s for %s"
		},
		between_stops: {
			label: "Arriving at %s %s"
		},
		post_route: {
			label: "Finished for the day"
		}
	}

	// The mobile is due out today
	if (location && !location.current_stop_id &&
		!location.previous_stop_id && location.next_stop_id &&
		moment(location.next_stop_arrival).isSame(moment(), 'day')) {
		const arrival = moment(location.next_stop_arrival).fromNow()
		return util.format(statuses.pre_route.label, location.next_stop_name, arrival);
	}

	// The mobile is at a stop, and will be for a certain amount of time
	if (location && location.current_stop_id) {
		const stop_remaining = moment(location.current_stop_departure).fromNow(true);
		return util.format(statuses.at_stop.label, location.current_stop_name, stop_remaining);
	}

	// The mobile is between stops
	if (location && !location.current_stop_id &&
		location.previous_stop_id && location.next_stop_id &&
		moment(location.previous_stop_departure).isSame(moment(), 'day') &&
		moment(location.next_stop_arrival).isSame(moment(), 'day')) {
		const arrival = moment(location.next_stop_arrival).fromNow();
		return util.format(statuses.between_stops.label, location.next_stop_name, arrival);

	}

	// The mobile has finished for the day
	if (location &&
		location.previous_stop_id && location.next_stop_id &&
		moment(location.previous_stop_departure).isSame(moment(), 'day') &&
		!moment(location.next_stop_arrival).isSame(moment(), 'day')) {
		return statuses.post_route.label;
	}

	return statuses.off_road.label;
}