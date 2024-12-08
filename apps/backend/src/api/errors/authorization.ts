import { LinkRecError } from "./";

class InvalidCredentialsError extends LinkRecError {
  constructor(){
    super("Invalid Username or password")
  }
}

class UnAuthorizedFieldError extends LinkRecError {
  constructor(fields: Record<any, string>) {
    super(
      "Trying to access a field without correct permissions",
      fields
    );
  }
}

class InvalidRoleError extends LinkRecError {
  constructor(fields: Record<any, string>) {
    super(
      "This field requires the correct role",
      fields
    );
  }
}

export {
  InvalidCredentialsError,
  UnAuthorizedFieldError,
  InvalidRoleError,
}
