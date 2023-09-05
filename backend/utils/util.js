const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: 'pwd',
    database: process.env.NODE_ENV === 'test' ? 'weshare_test' : 'weshare'
});

module.exports = {

    db: db,

    generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let result = 'u-';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
    },

    generateRandomNum(length) {
        const characters = '1234567890';
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return parseInt(result);
    },

    authorize_bearer: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const accessToken = token.split(' ')[1];
        try {
            // 'WeShare' 之後要移去.env
            const decoded = jwt.verify(accessToken, 'WeShare');
            req.user = decoded;
	    next();
        } catch (error) {
            return res.status(403).json({ error: 'Invalid token' });
        }
    },

    authorize_json: (req,res,next) => {
        const type = req.get('content-type')
        if (type !== 'application/json'){
            return res.status(415).json({ error: 'Invalid content type' })
        } else { next(); }
    },

    authorize_multipart: (req,res,next) => {
        const type = req.get('content-type')
        console.log("check type：",type.substring(0, 19))
        if (type.substring(0, 19) !== 'multipart/form-data'){
            console.log("current type is:",type)
            return res.status(415).json({ error: 'Invalid content type' })
        } else { next(); }
    },

    generateToken: (payload) => {
        // 'WeShare' 之後要移去.env
        const token = jwt.sign(payload, 'WeShare', { expiresIn: '1h' });
        return token;
    },

    emailValidate: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            return true
        } else {
            return false
        }
    },

    databaseError: (error,fn,res) => {
        console.error('Error happened at function -',fn)
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    },
}
