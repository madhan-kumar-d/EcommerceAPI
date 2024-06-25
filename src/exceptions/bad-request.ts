import { HTTPException, errorCodes } from './root';
export class BadRequestsException extends HTTPException {
  constructor(message: string, errorCode: errorCodes, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}
