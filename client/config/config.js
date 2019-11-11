const axios = require('axios');

const serverConfig = {
	domain:'https://c693cbe6-1b9e-4e5f-bcba-e385ef931e04.mock.pstmn.io',
	clientID:'amit',
	clientSecret:'amit',
};
const clientConfig = {
	IP:'127.0.0.1',
	port:'3000'
};

let country = (token) => {
	return axios.post(`${serverConfig.domain}/util/country`,token)
	.then(res=>res.data)
	.catch(err=>{
		throw new Error(err.response.data.error);
	});
};

let quote = (token) => {
	return axios.post(`${serverConfig.domain}/util/quote`,token)
	.then(res=>res.data)
	.catch(err=>{
		throw new Error(err.response.data.error);
	});
};
let currency = (token) => {
	return axios.post(`${serverConfig.domain}/util/currency`,token)
	.then(res=>res.data)
	.catch(err=>{
		throw new Error(err.response.data.error);
	});
};
let phoneCode = (token) => {
	return axios.post(`${serverConfig.domain}/util/phoneCode`,token)
	.then(res=>res.data)
	.catch(err=>{
		throw new Error(err.response.data.error);
	});
};

let datafmt = (token) => {
	return axios.post(`${serverConfig.domain}/util/datafmt`,token)
	.then(res=>res.data)
	.catch(err=>{
		throw new Error(err.response.data.error);
	});
};
module.exports = {
	serverConfig,
	clientConfig,
	country,
	quote,
	currency,
	phoneCode,
	datafmt	
};
