import { errorCodes, HTTPException } from './root';

export class InvalidInputsException extends HTTPException {
  constructor(message: string, errorCodes: errorCodes, errors: any) {
    super(message, errorCodes, 422, errors);
  }
}
