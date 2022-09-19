import { users } from "../app"
import BaseValidator from "../common/baseValidator"
import { User } from "../users/store"
import {MalformedQueryError, HostUserIDNotFoundError} from "./errors"

export default class HostUserIDValidator extends BaseValidator{

    override async validate(userID?: string): Promise<void>{
        if (!userID) throw new MalformedQueryError('Argument <hostUserId> missing in query!')
        const userExists = await this.userIDExists(userID)
        if (!userExists) throw new HostUserIDNotFoundError(`hostUserId ${userID} not found`)
    }

    async userIDExists(userID: string): Promise<boolean>{
        const user = await users.get(userID)
        return user === undefined ? false : true
    }

}