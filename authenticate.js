var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('./helpers/token.utils');
var validateTicket = require('./helpers/validateTicket');
var passport = require('passport');
require('./helpers/passport')();

router.route('/google-login')
    .post(passport.authenticate('google-token', { session: false }), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        const username = req.user.name.givenName || req.user.name.familyName;
        req.auth = { username };
        next();
    }, generateToken, sendToken);

router.route('/paws-login')
    .post(function(req, res, next) {
        const { access_token, isDevSite } = req.body;
        if (access_token) {
            validateTicket({ ticket: access_token, isDevSite }).then((nsid) => {
                req.auth = { username: nsid }
                next();
            }).catch((error) => {
                return res.send(401, error);
            });
        } else {
            return res.send(401, 'No Access Token');
        }
    }, generateToken, sendToken);


module.exports = router;