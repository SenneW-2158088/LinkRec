import { DegreeInput, EducationInput, educationInputSchema } from "./education"
import { EmployerLogin, employerloginSchema, EmployerRegister, employerRegisterSchema } from "./employer"
import { ExperienceInput, experienceSchema } from "./experience"
import { JobInput, jobSchema, JobUpdate } from "./job"
import { LoginInput, loginInputSchema, RegisterInput, userInputSchema } from "./user"
import { RequirementInput, RequirementUpdate } from "./requirement"

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

  export namespace Requirement {
    export type Input = RequirementInput;
    export type Update = RequirementUpdate;
  }

  export namespace Education {
    export const createSchema = educationInputSchema;
    export type Degree = DegreeInput;
    export type Input = EducationInput;
  }

  export namespace Job {
    export const createSchema = jobSchema;
    export type Input = JobInput;
    export type Update = JobUpdate;
  }
}
