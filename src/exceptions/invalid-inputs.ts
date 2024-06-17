import { errorCodes, HTTPException } from './root';

export class InvalidInputs extends HTTPException {
  constructor(message: string, errorCodes: errorCodes, errors: any) {
    super(message, errorCodes, 429, errors);
  }
}
