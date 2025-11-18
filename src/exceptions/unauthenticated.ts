import { errorCodes, HTTPException } from './root';

export class unauthenticatedException extends HTTPException {
  constructor(message: string, errorCodes: errorCodes, error: any) {
    super(message, errorCodes, 401, error);
  }
}
