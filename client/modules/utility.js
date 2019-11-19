const axios = require('axios')
const url = require('../config/config').url
module.exports = {
    validateUser : (opt)=>{

        let currOpt = {
            failedRedirect: 'http://127.0.0.1:3000/login',
            successRedirect: 'http://127.0.0.1:3000/dashboard',
            next:false
        };
        if( opt.hasOwnProperty('failedRedirect') ){
            currOpt['failedRedirect'] = opt['failedRedirect'];
        }
        if( opt.hasOwnProperty('successRedirect') ){
            currOpt['successRedirect'] = opt['successRedirect'];
        }
        if( opt.hasOwnProperty('next') ){
            currOpt['next'] = opt['next'];
        }
        return function( req, res, next ){


            if( currOpt['next'] ){
                next();
            }
            if( typeof(req.cookies) != 'object' ) {
                res.redirect(`${currOpt['failedRedirect']}`);
                return;
            }
            const user = req.cookies['user'];
            axios.post(`${url}/userToken/`, {
                accessToken,
                token : user.token
            }).then(resp=>resp.data)
            .then(resp => {
                if ( resp.valid ){
                    if(typeof(user) == 'object' && typeof(user.token) == 'string' && typeof(user.company) == 'object'){
                        if( currOpt['successRedirect'] ){
                            res.redirect(`${currOpt['successRedirect']}`);
                        }
                    }else {
                        res.redirect(`${currOpt['failedRedirect']}`);
                    }
                    next();
                }else{
                    res.clearCookie('user')
                }
            }).catch(err=>res.clearCookie('user'))

        }
    },

    validateObj : (obj, param)=>{
        if( typeof(param) == 'string' ){
            return typeof(obj) == param;
        }
        if( typeof(param) != 'object' && typeof(obj) != 'object'){
            return false;
        }
        let bool = true;
        for(var key in param ){
            if( obj.hasOwnProperty(key) ){
                bool = bool && ( param[key] == typeof(obj[key]) );
                if( !bool ) return false;
            }
        }
        return true;
    },
    authCheck: (req, callback)=>{
        const user = req.cookies['user'];
        if(typeof(user) != 'object' || typeof(user.token) != 'string' || typeof(user.company) != 'object') return callback(null)
        axios.post(`${url}/userToken/`, {
            accessToken,
            token : user.token
        }).then(resp=>resp.data)
        .then(resp => {
            if( resp.valid ){
                if(typeof(user) == 'object' && typeof(user.token) == 'string' && typeof(user.company) == 'object'){
                    callback(user);
                }else{
                    callback(null);
                }
            }else{
                callback(null);
            }
        }).catch(err=>callback(null))
    },
    getToday : ( datefmt ) => {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        if( typeof( datefmt) == 'string' ){
            if ('yyyy/mm/dd' == datefmt.trim() ) return `${y}/${m}/${d}`;
            else if ('dd/mm/yyyy' == datefmt.trim() ) return `${d}/${m}/${y}`;
            else if ('mm/dd/yyyy' == datefmt.trim() ) return `${m}/${d}/${y}`;
            else return new Error('getToday: Invalid datefmt');
        }else{
            return new Error('getToday: Invalid datefmt type, it should be string');
        }
    }, 
};
