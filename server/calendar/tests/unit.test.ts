/**
 * Tests for Calendar logic
 * 
 * @group unit
 */
 
import {StatusCodes} from 'http-status-codes';
import moment from 'moment';
import { handleErrors, getAvailability } from '../api';
import { MalformedQueryError, HostUserIDNotFoundError } from '../errors';
import { fillTimeSlots, getSavedEvents } from '../utils';
import HostUserIDValidator from '../validator';


describe("Error handling logic", () => {
 
    it("returns correct object when MalformedQueryError is raised", () => {
        const errorMsg = "Some malformed query detected"
        const error = new MalformedQueryError(errorMsg)
        
        const result = handleErrors(error)
        
        expect(result).toMatchObject({status: StatusCodes.BAD_REQUEST, message: errorMsg})
    });

    it("returns correct object when HostUserIDNotFoundError is raised", () => {
        const errorMsg = "UserID not found in the db"
        const error = new HostUserIDNotFoundError(errorMsg)
        
        const result = handleErrors(error)
        
        expect(result).toMatchObject({status: StatusCodes.NOT_FOUND, message: errorMsg})
    });

    it("returns correct object when an unexpected error is raised", () => {
        const errorMsg = "UnExpected error was raised"
        const error = new Error(errorMsg)
        
        const result = handleErrors(error)
        
        expect(result).toMatchObject({status: StatusCodes.INTERNAL_SERVER_ERROR, message: "An error occurred while fulfilling the request"})
    });
 
})

describe("getAvailability tests", () => {
    it ("returns the correct object in a successfull scenario", async () => {
        const hostUserID = "host_user_1"
        const response = await getAvailability(hostUserID)
        expect(response).toHaveProperty('status')
        expect(response).toHaveProperty('message')
        expect(response.status).toEqual(StatusCodes.OK)
    })

    it ("returns the correct object in a failure scenario", async () => {
        const response = await getAvailability(undefined)
        expect(response).toHaveProperty('status')
        expect(response).toHaveProperty('message')
        expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
    })

    it ("A successful request returns correct response schema in the response key", async () => {
        const hostUserID = "host_user_1"
        const response = await getAvailability(hostUserID)
        expect(response.status).toEqual(StatusCodes.OK)
        expect(response.data).toHaveProperty('name')
        expect(response.data).toHaveProperty('timeslotLengthMin')
        expect(response.data).toHaveProperty('timeslots')
    })
})


describe("validateHostUserID tests", () => {

    const validator = new HostUserIDValidator()

    afterEach(()=> jest.restoreAllMocks())
    
    it ("A null host user id throws a MalformedQueryError", async () => {
        expect(async () => validator.validate(undefined)).rejects.toThrow(MalformedQueryError)
    })

    it ("A non-existant user's request throws a HostUserIDNotFoundError", () => {
        const hostUserID = "non-existant-user"
        jest.spyOn(validator, "userIDExists").mockResolvedValue(false)
        expect(() => validator.validate(hostUserID)).rejects.toThrow(HostUserIDNotFoundError)
    })

    it ("An existing user validation returns void for success", async () => {
        const hostUserID = "host_user_1"
        expect(await validator.validate(hostUserID)).toBeUndefined()
    })
})

describe("getSavedEvents", () => {
    it("returns a sorted array of events saved in the db", async() => {
        const userID = 'userID'
        const db = require("db");
        jest.spyOn(db.calendar, "findEventsForUser").mockResolvedValue(
            [
                {start: "2021-09-11T16:00:00.000", end: "2021-09-11T17:00:00.000"},
                {start: "2021-09-22T09:00:00.000", end: "2021-09-22T17:00:00.000"},
                {start: "2021-09-19T10:00:00.000", end: "2021-09-19T17:00:00.000"},
                {start: "2021-09-30T11:00:00.000", end: "2021-09-30T17:00:00.000"},
                {start: "2021-09-05T14:00:00.000", end: "2021-09-05T17:00:00.000"},
                {start: "2021-09-15T15:50:00.000", end: "2021-09-15T17:00:00.000"}
            ]
        )

        const events = await getSavedEvents(userID)
        expect(events[0]).toMatchObject({start: "2021-09-05T14:00:00.000", end: "2021-09-05T17:00:00.000"})
    })
})


describe("fillTimeSlots", () => {
    it("returns an empty array if the time difference is less than one hour", async() => {
        const startTime = moment("2021-09-11T16:00:00.000")
        const stopTime = startTime.add(15, 'minutes')

        const slotsArray = await fillTimeSlots(startTime, stopTime)

        expect(slotsArray.length).toEqual(0)
    })

    it("inserts one timeslot when the diff between start and stop is 3 hours", async() => {
        const startTime = moment("2021-09-11T12:00:00.000")
        const stopTime = startTime.clone().add(3, 'hours')
        
        const slotsArray = await fillTimeSlots(startTime, stopTime)
        
        expect(slotsArray.length).toEqual(3)
        expect(slotsArray).toMatchObject([
            "2021-09-11T12:00:00.000",
            "2021-09-11T13:00:00.000",
            "2021-09-11T14:00:00.000",
        ])
    })
})