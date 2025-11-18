import { errorCodes, HTTPException } from './root';

export class conflictException extends HTTPException {
  constructor(message: string, errorCodes: errorCodes, error: any) {
    super(message, errorCodes, 409, error);
  }
}
