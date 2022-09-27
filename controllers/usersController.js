const User = require("../models/User");
module.exports = {

    register : async ( req, res, next ) =>  {
        try {
            const { email } = req.body
            const userAlready = await User.findOne( { email } );
            if ( userAlready ) {
                res.status( 201 ).json( { userAlreadyCreated: userAlready.userJSON() } );
            } else { 
                var user = await User.create( req.body );
                const token = await user.signToken();
                console.log(token,"token")
                res.status( 201 ).json( { user: user.userJSON(token) } );
            }
        } catch (error) {
            return next( error )
        }
    },

    login :  async ( req, res, next ) =>  {
        try {
            const { email, password } = req.body;
            if ( !email || !password ) {
                return res.status( 400 ).json( { error: "Email & Password is required" } );
            }
            const user = await User.findOne( { email } )
            if ( !user ) {
                return res.status( 400 ).json( { error: "Email not registered" } );
            }
            const result = await user.verifyPassword( String(password) );
            if ( !result ) {
                return res.status( 400 ).json( { error: "Invalid password" } )
            }
            const token = await user.signToken();
            console.log(token,"token");
            res.status( 201 ).json( { login: result, user: user.userJSON(token)  } );
        } catch (error) {
            return next( error );
        }
    },

    allUsers : async( req, res, next ) => {
        try {
            const user = await User.find();
            res.status(200).json({user:user})
        } catch (error) {
            return next ( error )
        }
    },

    
}
