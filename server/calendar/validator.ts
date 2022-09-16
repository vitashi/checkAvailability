import BaseValidator from "../baseValidator"
import {MalformedQueryError, HostUserIDNotFoundError} from "./errors"

export default class HostUserIDValidator extends BaseValidator{

    override validate(userID?: string): void{
        if (!userID) throw new MalformedQueryError('Argument <hostUserId> missing in query!')
        if (!this.userIDExists(userID)) throw new HostUserIDNotFoundError(`hostUserId ${userID} not found`)
    }

    userIDExists(userID: string): boolean{
        return true
    }

}