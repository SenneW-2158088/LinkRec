import { GraphQLError } from "graphql";

export class LinkRecError extends Error {
  constructor(
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toGraphQL(): GraphQLError {
    return new GraphQLError(this.message, {
      extensions: {
        details: this.details,
      },
    });
  }
}
