'use strict';

const serverConfig = require('../config/config').serverConfig;
const axios = require('axios');
const util = require('./utility');

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
        if( !util.validateObj(this.serverConfig,{clientID:'string',clientSecret:'string'}) ){
            throw new Error('serverConfig is initialized');
        }
        try{
            let res = await axios.post(`${this.serverConfig.domain}/init`, {
                clientID:this.serverConfig.clientID,
                clientSecret:this.serverConfig.clientSecret
            });
            console.log(res.data);
            this.serverKey = {...res.data};
            this.router.use( function(req,resp,next){
                req.serverKey = {...res.data};
                next();
            });
            return res;
        }catch(err){
            throw new Error(err.response.data.error);
        }
    }

    async login(user){
        if( this.serverKey == null ){
            console.log("Not connected to server");
            return null;
        }
        try{
            if( util.validateObj(user,{username:'string',password:'string'})) {
                const userRes = await axios.post(`${this.loginRoute}`, {
                    ...user,
                    ...this.serverKey,
                    error:null
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
                    error:null
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