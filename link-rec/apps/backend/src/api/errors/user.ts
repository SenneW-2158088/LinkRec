import { LinkRecError } from "./";

class UserNotFoundError extends LinkRecError {
  constructor(identifier: string) {
    super(
      'User not found',
      { identifier }
    );
  }
}

export { UserNotFoundError }
