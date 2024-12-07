import { employerQuery } from "./queries";
import { Employer as IEmployer, EmployerInputType, EmployerLoginInputType, EmployerType } from "./types";

export namespace Employer {

  export type Type = IEmployer;

  export const Employer = EmployerType;

  export const Login = EmployerLoginInputType;

  export const Register = EmployerInputType;

  export const queries = {
    "employer": employerQuery,
  }

  export const mutations = {}
}
