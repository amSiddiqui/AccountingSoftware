const axios = require('axios');

const serverConfig = {
	domain: 'http://localhost:8000/Application',
	clientID:'AccountingSoftware',
	clientSecret:'Secret',
};
const clientConfig = {
	IP:'127.0.0.1',
	port:'3000'
};

const postConfig = {
	'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
};

module.exports = {
	serverConfig,
	clientConfig,
	postConfig,
	url: 'http://localhost:8000/Application'
};
