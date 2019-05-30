// Axios for making requests
import axios from 'axios';

const config = require('./config.json');

// getAllMobiles: 
export function getAllRoutes(callback) {
	axios.get(config.api + '/api/routes')
		.then(response => {
			if (response && response.data) {
				callback(response.data);
			} else {
				callback([]);
			}
		})
		.catch(err => callback([]));
}