// standard js class extending Error class
export class HTTPException extends Error {
  statusCode: number;
  message: string;
  errorCode: errorCodes;
  error: any;
  constructor(
    message: string,
    errorCode: errorCodes,
    statusCode: number,
    error: any,
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export enum errorCodes {
  NO_DATA_FOUND = 10000,
  USER_NOT_FOUND = 10001,
  USER_ALREADY_EXISTS = 10002,
  INVALID_USER_CREDENTIALS = 10003,
  UNABLE_TO_PROCESS_INPUT_DATA = 10004,
  UNAUTHORIZED_ACCESS = 10005,
}
