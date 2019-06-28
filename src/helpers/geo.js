// Axios for making requests
import axios from 'axios';

// getCurrentLocation: 
export function getCurrentPosition(callback) {
	var options = {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
	};
	navigator.geolocation.getCurrentPosition((pos) => {
		callback([pos.coords.longitude, pos.coords.latitude]);
	}, err => {
		callback([]);
	}, options);
};

// Get postcode data
export function getPostcode(postcode, callback) {
	axios.get('https://api.postcodes.io/postcodes/' + postcode)
		.then(response => {
			if (response && response.data && response.data.result) {
				callback([response.data.result.longitude, response.data.result.latitude]);
			} else {
				callback([]);
			}
		})
		.catch(err => callback([]));
};