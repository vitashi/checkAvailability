/**
 * calendar api module
 * @module api
 */

import {StatusCodes} from 'http-status-codes';
import { users } from '../app';
import { IAPIResult } from '../common/types';
import {CalendarAPIErrors} from "./errors"
import { IResultObject } from './types';
import { getAvailableTimeSlots } from './utils';
import HostUserIDValidator from './validator';


export const getAvailability = async (hostUserId?: string): Promise<IResultObject> => {
  try{
    const hostUserIdValidator = new HostUserIDValidator()
    await hostUserIdValidator.validate(hostUserId)

    const user = await users.get(hostUserId!)
    const availableSlots = await getAvailableTimeSlots(hostUserId!)

    const trialJsonResult: IAPIResult = {
      name: user?.name!,
      timeslotLengthMin: 60,
      timeslots: availableSlots
    }

    const resultObject: IResultObject = {
      status: StatusCodes.OK,
      message: "Success",
      data: trialJsonResult
    }

    return resultObject

  }catch(error){
    return handleErrors(error)
  }
}

export const handleErrors = (error: unknown): IResultObject => {

  const resultObject: IResultObject = {
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "An error occurred while fulfilling the request"
  }

  if (error instanceof CalendarAPIErrors){
    console.error(error.name, error.message)
    resultObject.status = error.httpStatusCode;
    resultObject.message = error.message;
  }else{
    console.error(error)
    resultObject.status = StatusCodes.INTERNAL_SERVER_ERROR;
    resultObject.message = "An error occurred while fulfilling the request";
  }

  return resultObject
}
