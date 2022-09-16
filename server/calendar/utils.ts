import {MalformedQueryError, HostUserIDNotFoundError} from "./errors"

export const validateHostUserID = (userID?: string) => {

    if (!userID) throw new MalformedQueryError('Argument <hostUserId> missing in query!')
    if (!userIDExists(userID)) throw new HostUserIDNotFoundError(`hostUserId ${userID} not found`)

}

export const userIDExists = (userID: string) =>{
    return true
}
