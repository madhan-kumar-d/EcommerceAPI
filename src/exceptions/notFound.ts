import { HTTPException, errorCodes } from './root';

export class pageNotFound extends HTTPException {
  constructor(message: string) {
    super(message, errorCodes.PAGE_NOT_FOUND, 404, null);
  }
}
