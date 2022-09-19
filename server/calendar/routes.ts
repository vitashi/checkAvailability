/**
 * Calendar routes module
*/

import express from "express";
import { getAvailability } from "./api";


const routes = express.Router();

routes.get('/api/calendar', async (request: express.Request, response: express.Response) => {
  const {hostUserId} = request.query
  const userID = typeof hostUserId == "string" ? hostUserId : undefined

  const apiResult = await getAvailability(userID)
  response.status(apiResult.status).json(apiResult.data);
  console.log(`Response details HostUserID: ${hostUserId}, statusCode: ${apiResult.status}, resultMessage: ${apiResult.message}`)
  
})

export default routes
