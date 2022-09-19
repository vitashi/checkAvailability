/**
 * Tests for Calendar logic
 * 
 * @group unit
 */
 
import {StatusCodes} from 'http-status-codes';
import { handleErrors, getEventsForUser } from '../api';
import { MalformedQueryError, HostUserIDNotFoundError } from '../errors';
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

describe("getEventsForUser tests", () => {
    it ("returns the correct object in a successfull scenario", async () => {
        const hostUserID = "host_user_1"
        const response = await getEventsForUser(hostUserID)
        expect(response).toHaveProperty('status')
        expect(response).toHaveProperty('message')
        expect(response.status).toEqual(StatusCodes.OK)
    })

    it ("returns the correct object in a failure scenario", async () => {
        const response = await getEventsForUser(undefined)
        expect(response).toHaveProperty('status')
        expect(response).toHaveProperty('message')
        expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
    })

    it ("A successful request returns correct response schema in the response key", async () => {
        const hostUserID = "host_user_1"
        const response = await getEventsForUser(hostUserID)
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