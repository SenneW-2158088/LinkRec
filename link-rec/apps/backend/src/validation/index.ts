import { DegreeType, EducationInput, educationInputSchema } from "./degree"
import { EmployerLogin, employerloginSchema, EmployerRegister, employerRegisterSchema } from "./employer"
import { ExperienceInput, experienceSchema } from "./experience"
import { LoginInput, loginInputSchema, RegisterInput, userInputSchema } from "./user"

export namespace Validation {

  export namespace Experience {
    export const createSchema = experienceSchema
    export type Input = ExperienceInput
  }

  export namespace Employer {
    export const loginSchema = employerloginSchema
    export const registerSchema = employerRegisterSchema
    export type Login = EmployerLogin
    export type Register = EmployerRegister
  }

  export namespace User {
    export const loginSchema = loginInputSchema
    export const registerSchema = userInputSchema
    export type Login = LoginInput
    export type Register = RegisterInput
  }

  export namespace Education {
    export const createSchema = educationInputSchema;
    export type Degree = DegreeType;
    export type Input = EducationInput;
  }
}
