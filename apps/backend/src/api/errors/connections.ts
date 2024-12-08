import { exit } from "process";
import { LinkRecError } from "./";

class ConnectionNotFoundError extends LinkRecError {
  constructor(userId: string) {
      super(
        "There is no connection with user",
        {
          user: userId
        }
      )
  }
}

export {
  ConnectionNotFoundError
}
