import { LinkRecError } from "./error";

export class UserNotFoundError extends LinkRecError {
  constructor(identifier: string) {
    super(
      'User not found',
      { identifier }
    );
  }
}
