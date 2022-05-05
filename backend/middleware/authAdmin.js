
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
    try {
     
        const token = req.headers.authorization.split(' ')[1];
        
        const decodedToken = jwt.verify(token, `${process.env.SECRET_KEY}`);
       
        const isAdmin = decodedToken.isAdmin;
        if (isAdmin !== true) {
            throw 'interdit aux non admins';

        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error
        });
    }
};