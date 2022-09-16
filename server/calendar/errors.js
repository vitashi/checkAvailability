const { StatusCodes } = require('http-status-codes');

class CalendarAPIErrors extends Error {
    constructor(message) {
        super(message);
      }
}

class MalformedQueryError extends CalendarAPIErrors {
    constructor(message) {
      super(message);
      this.name = "MalformedQueryError";
      this.httpStatusCode = StatusCodes.BAD_REQUEST

    }
  }

class HostUserIDNotFoundError extends CalendarAPIErrors {
    constructor(message) {
        super(message);
        this.name = "HostUserIDNotFoundError";
        this.httpStatusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = {
    CalendarAPIErrors,
    MalformedQueryError,
    HostUserIDNotFoundError
}
