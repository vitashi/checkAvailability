/**
 * Calendar routes module
*/

const express = require('express');
const routes = express.Router();

routes.get('/api/calendar', require('./api'))

module.exports = routes
