const serverConfig = require('../config/config').serverConfig;
const axios = require('axios');
const util = require('./utility');

class Authentication{
    constructor(router){
        this.router = router;
        this.serverConfig = {...serverConfig};
        this.serverKey = {accessToken:'1234'};
        this.loginRoute = `${this.serverConfig.domain}/auth/login`;
        this.logoutRoute = `${this.serverConfig.domain}/auth/logout`;
        this.signUpRoute = `${this.serverConfig.domain}/auth/signup`;
    }

    async conn(){
        // TODO: remove
        const serverKey = {accessToken:'1234'};
        return {serverKey};




        if( !util.validateObj(this.serverConfig,{clientID:'string',clientSecret:'string'}) ){
            throw new Error('serverConfig is initialized');
        }
        try{
            let res = await axios.post(`${this.serverConfig.domain}/init`, {
                clientID:this.serverConfig.clientID,
                clientSecret:this.serverConfig.clientSecret
            });
            this.serverKey = {accessToken: res.data.accessToken};
            this.router.use( function(req,resp,next){
                req.serverKey = {accessToken: res.data.accessToken};
                next();
            });
            return res;
        }catch(err){
            throw new Error(err.response.data.error);
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
                })
                return userRes.data;
            }else{
                return {
                    profile:null,
                    userToken:null,
                    error:'invalid user input' 
                }
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
                })
                return userRes.data;
            }else{
                return {
                    profile:null,
                    userToken:null,
                    error:'invalid user input' 
                }
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
                })
                return userRes.data;
            }else{
                return {
                    error:'invalid user input' 
                }
            }
        }catch(err){
            console.log(err.response.data.error);
            return {
                error:err.response.data.error,
            };
        }
    }
};

module.exports = Authentication;