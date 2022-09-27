const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = { 
    verifyToken: async ( req, res, next ) => {
        const token = req.headers.authorization
        try {
            if ( token ) {
                const payload = await jwt.verify( token, process.env.SECRET );
                req.users = payload;
                next();
            } else {
                res.status( 400 ).json( { error: "ACCESS: DENIED! (Token Required)" } );
            }
        } catch (error) {
            return next ( error )
        }
    },

    authOpt: async ( req, res, next ) => {
        const token = req.headers.authorization
        try {
            if ( token ) {
                const payload = await jwt.verify( token, process.env.SECRET );
                req.users = payload;
                next();
            } else {
                next();
            }
        } catch (error) {
            return next ( error )
        }
    }
}