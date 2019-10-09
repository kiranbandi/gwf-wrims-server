const expressJwt = require('express-jwt');
const config = require('../config');

module.exports = jwt;

function jwt() {
    const secret = config.key;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/api/auth/google-login',
            '/api/auth/paws-login',
            // bypassing the following routes 
            // as the homepage is being made public
            '/records/flow-data',
            '/records/yearly-flow-data',
            '/nodes/get-nodes'
            // only routes that edit nodes are protected
        ]
    });
}

//  We currently use a HS256 , Hash based authentication
//  But this will be updated to a RS 256 Signature

//  Also the timing for the JWT to be currently active 
// should be less probably an hour for now ?