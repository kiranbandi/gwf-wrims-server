var jwt = require('jsonwebtoken');
var config = require('../config');

var createToken = function(auth) {
    return jwt.sign({ id: auth.id }, config.key, { expiresIn: 60 * 120 });
};

module.exports = {
    generateToken: function(req, res, next) {
        req.token = createToken(req.auth);
        return next();
    },
    sendToken: function(req, res) {
        return res.status(200).send(JSON.stringify({ user: req.user, token: req.token }));
    }
};