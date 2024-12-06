import { LinkRecError } from "./error";

export class InvalidCredentialsError extends LinkRecError {
  constructor(message = 'Invalid email or password') {
    super(message);
  }
}
