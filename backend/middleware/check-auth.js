const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    // Because in headers -> authorization is stored in the format of ('Bearer kshd1298hcnsamc(token)') so thats why we split this header.
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch(error) {
    res.status(401).json({message: 'You are not authenticated!'});
  }
};
