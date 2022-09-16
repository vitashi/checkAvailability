import {StatusCodes} from 'http-status-codes';

export class CalendarAPIErrors extends Error {
  httpStatusCode: StatusCodes;

  constructor(message: string) {
      super(message);
      this.httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }
}

export class MalformedQueryError extends CalendarAPIErrors {
  constructor(message: string) {
    super(message);
    this.name = "MalformedQueryError";
    this.httpStatusCode = StatusCodes.BAD_REQUEST
  }
}

export class HostUserIDNotFoundError extends CalendarAPIErrors {
  constructor(message: string) {
      super(message);
      this.name = "HostUserIDNotFoundError";
      this.httpStatusCode = StatusCodes.NOT_FOUND
  }
}
