import { HTTPException, errorCodes } from './root';

export class noRecordFound extends HTTPException {
  constructor(message: string, errorCodes: errorCodes, error: any) {
    super(message, errorCodes, 200, error);
  }
}
