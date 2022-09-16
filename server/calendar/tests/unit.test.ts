/**
 * Tests for Calendar logic
 * 
 * @group unit
 */
 
import {StatusCodes} from 'http-status-codes';
import { handleErrors, getEventsForUser } from '../api';
import { MalformedQueryError, HostUserIDNotFoundError } from '../errors';
import { validateHostUserID,  userIDExists} from '../utils';
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

    // it("returns a MALFORMED response object for an incorrect url", async () => {
    //     const rawURL = "malformedurl";
    //     const response = await encode({rawURL: rawURL});
    //     expect(response).toMatchObject<IEncodeAPIResults>({status: StatusCodes.BAD_REQUEST, results: {message: EncodeMessages.MALFORMED, rawURL: rawURL}})
    // });

    // it("returns a CONFLICT response object for duplicate request", async () => {
    //     const rawURL = "http://localhost/someurl"
    //     const hash = "hash"
    //     jest.spyOn(store, "getHash").mockResolvedValue(hash)
    //     jest.spyOn(store, "put").mockRejectedValue(new Error("error raised during put"))
    //     const response = await encode({rawURL: rawURL});
    //     expect(response).toMatchObject<IEncodeAPIResults>({status: StatusCodes.CONFLICT, results: {message: EncodeMessages.CONFLICT, rawURL: rawURL}})
    // });
 
})

describe("getEventsForUser tests", () => {
    it ("returns the correct object in a successfull scenario", () => {
        const hostUserID = "host_user_1"
        const response = getEventsForUser(hostUserID)
        expect(response).toHaveProperty('status')
        expect(response).toHaveProperty('message')
        expect(response.status).toEqual(StatusCodes.OK)
    })

    it ("returns the correct object in a failure scenario", () => {
        const response = getEventsForUser(undefined)
        expect(response).toHaveProperty('status')
        expect(response).toHaveProperty('message')
        expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
    })

    it ("A successful request returns correct response schema in the response key", () => {
        const hostUserID = "host_user_1"
        const response = getEventsForUser(hostUserID)
        expect(response.status).toEqual(StatusCodes.OK)
        expect(response.data).toHaveProperty('name')
        expect(response.data).toHaveProperty('timeslotLengthMin')
        expect(response.data).toHaveProperty('timeslots')
    })
})


describe("validateHostUserID tests", () => {

    const validator = new HostUserIDValidator()
    
    it ("A null host user id throws a MalformedQueryError", () => {
        expect(() => validator.validate(undefined)).toThrow(MalformedQueryError)
    })

    it ("A non-existant user's request throws a HostUserIDNotFoundError", () => {
        const hostUserID = "non-existant-user"
        jest.spyOn(validator, "userIDExists").mockReturnValue(false)
        expect(() => validator.validate(hostUserID)).toThrow(HostUserIDNotFoundError)
    })
})