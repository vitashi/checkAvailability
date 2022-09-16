/**
 * Calendar routes module
*/

const express = require('express');
const routes = express.Router();
const callAPI = require('./api')

routes.get('/api/calendar', (request, response) => {
  const { hostUserId } = request.query;

  const apiResult = callAPI(hostUserId)
  
  response.status(apiResult.status)
  .json(apiResult.response);
})

module.exports = routes
