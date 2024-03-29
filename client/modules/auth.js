const serverConfig = require('../config/config').serverConfig;
const axios = require('axios');
const util = require('./utility');

class Authentication{
    constructor(){
        this.serverConfig = {...serverConfig};
        this.accessToken = null;
        this.loginRoute = `${this.serverConfig.domain}/auth/login`;
        this.logoutRoute = `${this.serverConfig.domain}/auth/logout`;
        this.signUpRoute = `${this.serverConfig.domain}/auth/signup`;
    }

    async conn(){
        console.log('Connection procedure initialized');
        if( !util.validateObj(this.serverConfig,{clientID:'string',clientSecret:'string'}) ){
            throw new Error('serverConfig is initialized');
        }
        try{
            console.log('Awating reposnse for init');
            var payload = {
                clientId:this.serverConfig.clientID,
                secret:this.serverConfig.clientSecret,
            };
            let res = await axios.post(`${this.serverConfig.domain}/init/`, payload);
            this.accessToken = res.data.accessToken;

            return {
                accessToken: this.accessToken,
                ...res.data.data,
            };
        }catch(err){
            throw new Error(err);
        }
    }
}

module.exports = Authentication;