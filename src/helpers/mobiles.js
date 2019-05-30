// Axios for making requests
import axios from 'axios';

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