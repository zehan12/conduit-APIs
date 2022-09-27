const User = require('../models/User');
const Article = require('../models/Article')

module.exports = {
  getUsername: async (req, res, next) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username }).select('username bio image following').populate({ path:'articles', model: Article})
      console.log("arti",user)

      if (!req.users) {
        res.status(201).json({
          profile:
          {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: false
          },
        })
        res.end()
      } else {
        console.log(user)
        console.log(user.following)
        const following = user.following.includes(req.users.userId);
        if (user) {
          res.status(201).json({
            profile:
            {
              username: user.username,
              bio: user.bio,
              image: user.image,
              following: following
            }
          });
        } else {
          res.status(400).json({ error: "user not found!" })
        }
      }
    } catch (error) {
      return next(error)
    }
  },

  followUser: async (req, res, next) => {
    try {
      const username = req.params.username;
      const userToFollow = await User.findOne({ username });
      //* user not found
      if (!userToFollow) {
        res.status(400).json({ error: "User not found" })
      }
      //* user to follow found
      if (userToFollow) {
        const userFollwingList = await User.findById(req.users.userId);
        //* user already following 
        if (userFollwingList.following.some((v) => String(v) === String(userToFollow._id))) {
          return res.status(400).json({ error: "you already follow this user" })
        }
        //* user and following are not same
        if (req.users.userId != userToFollow._id) {
          const user = await User.findByIdAndUpdate(req.users.userId, { $push: { following: userToFollow._id } }, { new: true });
          await User.findByIdAndUpdate(userToFollow._id, { $push: { followers: req.users.userId } }, { new: true })
          res.status(201).json({
            msg: `${user.username} follow ${userToFollow.username}`, profile: {
              email: user.email,
              bio: user.bio,
              image: user.image,
              following: user.following
            }
          })
        }
        //* user and following user same
        if (req.users.userId == userToFollow._id) {
          res.status(400).json({ error: "you can't follow yourself" })
        }
      }
    } catch (error) {
      return next(error)
    }
  },

  unfollowUser: async (req, res, next) => {
    try {
      const username = req.params.username;
      const userToUnfollow = await User.findOne({ username });
      //* user not found
      if (!userToUnfollow) {
        res.status(400).json({ error: "User not found" })
      }
      //* user and unfollowing user same
      if (req.users.userId == userToUnfollow._id) {
        res.status(400).json({ error: "you can't unfollow yourself" })
      }
      if (userToUnfollow) {
        if (req.users.userId != userToUnfollow._id) {
          const user = await User.findByIdAndUpdate(req.users.userId, { $pull: { following: userToUnfollow._id } }, { new: true });
          await User.findByIdAndUpdate(userToUnfollow._id, { $pull: { followers: req.users.userId } })
          res.status(201).json({
            msg: `${user.username} unfollow ${userToUnfollow.username}`, proflie: {
              email: user.email,
              bio: user.bio,
              image: user.image,
              following: user.following
            }
          })
        }
        if (req.users.userId == userToUnfollow._id) {
          res.status(400).json({ error: "you can't follow yourself" })
        }
      }
    } catch (error) {
      return next(error);
    }
  }

}

