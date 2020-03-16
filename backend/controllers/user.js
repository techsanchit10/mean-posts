const bcrypt = require('bcryptjs'); // installed through NPM to provide password encryption
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
              message: 'Account with same email already exist!'
          });
        });
    });
}


exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
   .then(user => {
    if(!user) {
      return res.status(401).json({
        message: "No such user exist!"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
   })
   .then(result => {
    if (!result) {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT_KEY,
      { expiresIn: "1h"}
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600, // 1hr in seconds
      userId: fetchedUser._id
    });
   })
   .catch(err => {
     console.log(err);
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
   });
}