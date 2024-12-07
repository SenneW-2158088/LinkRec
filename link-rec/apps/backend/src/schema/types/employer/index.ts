import { GQLTypes } from "..";
import { employerLoginMutation, employerRegisterMutation } from "./mutations";
import { employerQuery } from "./queries";
import { EmployerInputType, EmployerLoginInputType, EmployerType } from "./types";

export namespace Employer {
  export interface Type {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    webPage?: string | null;
    jobs: GQLTypes.Job.Type[];
  }

  export const Employer = EmployerType;

  export const Login = EmployerLoginInputType;

  export const Register = EmployerInputType;

  export const queries = {
    "employer": employerQuery,
  }

  export const mutations = {
    "employerLogin": employerLoginMutation,
    "employerRegister": employerRegisterMutation,
  }
}
