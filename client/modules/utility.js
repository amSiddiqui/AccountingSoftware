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
            // TODO: Remove
            next();
            return;

            if( currOpt['next'] ){
                next();
            }
            if( typeof(req.cookies) == 'object' ) {
                res.redirect(`${currOpt['failedRedirect']}`);
                next();
            }
            const user = req.cookies['user'];
            // console.log(req.)
            if(typeof(user) == 'object' && typeof(user.token) == 'string' && typeof(user.profile) == 'object'){
                if( currOpt['successRedirect'] ){
                    res.redirect(`${currOpt['successRedirect']}`);
                }else{
                    next();
                }
            }else {
                res.redirect(`${currOpt['failedRedirect']}`);
            }
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
        if(typeof(user) == 'object' && typeof(user.token) == 'string' && typeof(user.company) == 'object'){
            callback(user);
        }else{
            callback(null);
        }
    },
};