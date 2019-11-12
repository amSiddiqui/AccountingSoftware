const axios = require('axios');

const serverConfig = {
<<<<<<< HEAD
	domain: 'http://localhost:8000/Application',//'https://c693cbe6-1b9e-4e5f-bcba-e385ef931e04.mock.pstmn.io',
	clientID:'amit',
	clientSecret:'amit',
=======
	domain: 'http://localhost:8000/Application',
	clientID:'AccountingSoftware',
	clientSecret:'Secret',
>>>>>>> 8fe7114ec57602258c5f82bf6272767cd122e2bc
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
