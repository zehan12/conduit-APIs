const User = require("../models/User");
module.exports = {
    //! current user to display
    currentUser : async ( req, res, next ) => {
        try {
            console.log(req.users.userId)
            const user = await User.findById( req.users.userId ).select('-password');
             console.log(user)
            res.status( 201 ).json( { user: {
                email: user.email,
                token: req.headers.authorization,
                username: user.name,
                bio: user.bio,
                image: user.image
            } } )
        } catch ( error ) {
            return next ( error );
        }
    },

    //! update a user
    updateUser : async ( req, res, next ) => {
        try {
            const updateUser = req.body;
            const updatedUser = await User.findByIdAndUpdate( req.users.userId, updateUser, { new: true } );
            res.status( 201 ).json( { user: {
                email: updatedUser.email,
                bio: updatedUser.bio,
                image: updatedUser.image
                } } )
        } catch ( error ) {
            return next ( error )
        }
    },

}