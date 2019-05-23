var jwt = require('jsonwebtoken');
var config = require('../config');

var createToken = function(username) {
    return jwt.sign({ username }, config.key, { expiresIn: 60 * 120 });
};

module.exports = {
    generateToken: function(req, res, next) {
        req.token = createToken(req.auth.username);
        return next();
    },
    sendToken: function(req, res) {
        return res.status(200).send(JSON.stringify({ username: req.auth.username, token: req.token }));
    }
};