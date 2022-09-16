/**
 * Calendar routes module
*/

import express from "express";
import { getEventsForUser } from "./api";


const routes = express.Router();

routes.get('/api/calendar', (request: express.Request, response: express.Response) => {
  const {hostUserId} = request.query
  const userID = typeof hostUserId == "string" ? hostUserId : undefined

  const apiResult = getEventsForUser(userID)
  response.status(apiResult.status)
  .json(apiResult.data);
  console.log(`HostUserID: ${hostUserId}, statusCode: ${apiResult.status}, resultMessage: ${apiResult.message}`)
  
})

module.exports = routes
