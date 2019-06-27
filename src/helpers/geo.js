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