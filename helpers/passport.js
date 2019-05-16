'use strict';
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('../config');

module.exports = function() {
    passport.use(new GoogleTokenStrategy({
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_SECRET
        },
        function(accessToken, refreshToken, profile, done) {
            return done(false, profile);
        }));
};