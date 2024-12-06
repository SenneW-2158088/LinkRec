import { z } from "zod";
import { LinkRecError } from "./error";

export class ValidationError extends LinkRecError {
  constructor(validationErrors: Record<string, string[]>) {
    super(
      'Validation failed',
      { validationErrors }
    );
  }

  static fromZodError(error: z.ZodError): ValidationError {
    const formattedErrors: Record<string, string[]> = {};

    error.errors.forEach(err => {
      const field = err.path.join('.');
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(err.message);
    });

    return new ValidationError(formattedErrors);
  }
}
