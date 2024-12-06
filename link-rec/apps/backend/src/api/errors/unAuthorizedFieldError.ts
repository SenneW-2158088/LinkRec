import { LinkRecError } from "./error";

export class UnAuthorizedFieldError extends LinkRecError {
  constructor(message = "Trying to access a field without correct permissions") {
    super(message);
  }
}
