class CalendarAPIErrors extends Error {
    constructor(message) {
        super(message);
      }
}

class MalformedQueryError extends CalendarAPIErrors {
    constructor(message) {
      super(message);
      this.name = "MalformedQueryError";
    }
  }

class HostUserIDNotFoundError extends CalendarAPIErrors {
    constructor(message) {
        super(message);
        this.name = "HostUserIDNotFoundError";
    }
}

module.exports = {
    MalformedQueryError,
    HostUserIDNotFoundError
}
