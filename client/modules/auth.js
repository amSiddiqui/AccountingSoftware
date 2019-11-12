const serverConfig = require('../config/config').serverConfig;
const axios = require('axios');
const util = require('./utility');
const qs = require('querystring');

class Authentication{
    constructor(router){
        this.router = router;
        this.serverConfig = {...serverConfig};
        this.serverKey = null;
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
                something: 'Something'
            };
            var config = {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            };
            let res = await axios.post(`${this.serverConfig.domain}/init/`, qs.stringify(payload), config);
            this.serverKey = {accessToken: res.data.accessToken};
            accessToken = this.serverKey;

            console.log('Initializing connection with Database at url '+dburl);
            console.log('Client Access Token: ', accessToken);

            this.router.use( function(req,resp,next){
                req.serverKey = {accessToken: res.data.accessToken};
                next();
            });
            return this.serverKey;
        }catch(err){
            throw new Error(err);
        }
    }

    async login(user){
        // TODO: Remove
        return {
            profile:{firstName: 'Sam', lastName: 'Harris', company: 'Pineapple'},
            userToken:'123',
            error: null 
        };

        
        if( this.serverKey == null ){
            console.log("Not connected to server");
            return null;
        }
        try{
            


            
            if( util.validateObj(user,{username:'string',password:'string'})) {
                const userRes = await axios.post(`${this.loginRoute}`, {
                    ...user,
                    ...this.serverKey,
                });
                return userRes.data;
            }else{
                return {
                    profile:null,
                    userToken:null,
                    error:'invalid user input' 
                };
            }
        }catch(err){
            console.log(err.response.data.error);
            return {
                profile:null,
                userToken:null,
                error:err.response.data.error,
            };
        }
    }


    async signUp(user){
        if( this.serverKey == null ){
            console.log("Not connected to server");
            return null;
        }
        try{
            if( util.validateObj(user,{username:'string',password:'string', profile: 'object'}))  {
                const userRes = await axios.post(`${this.signUpRoute}`, {
                    ...user,
                    ...this.serverKey,
                });
                return userRes.data;
            }else{
                return {
                    profile:null,
                    userToken:null,
                    error:'invalid user input' 
                };
            }
        }catch(err){
            console.log(err.response.data.error);
            return {
                profile:null,
                userToken:null,
                error:err.response.data.error,
            };
        }
    }

    async logout(user){
        try{
            if ( typeof(user) == 'object' && user.token ){
                let userRes = await axios.post(`${this.logoutRoute}`,{
                    userToken:user.token,
                    ...this.serverKey,
                    error:null
                });
                return userRes.data;
            }else{
                return {
                    error:'invalid user input' 
                };
            }
        }catch(err){
            console.log(err.response.data.error);
            return {
                error:err.response.data.error,
            };
        }
    }
}

module.exports = Authentication;