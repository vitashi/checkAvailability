const errors = require('./errors');

const validateHostUserID = (userID) => {

    if (!userID) throw new errors.MalformedQueryError('Argument <hostUserId> missing in query!')
    if (!userIDExists(userID)) throw new errors.HostUserIDNotFoundError(`hostUserId ${userID} not found`)

}

const userIDExists = (userID) => {
    return true
}

module.exports = {
    validateHostUserID,
    userIDExists
}
