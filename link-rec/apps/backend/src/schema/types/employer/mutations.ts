import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Employer, EmployerAuthPayload, EmployerAuthPayloadType, EmployerInputType, EmployerLoginInputType, EmployerType } from "./types"
import { EmployerInput, EmployerLoginInput } from "../../../validation/employer"
import { ApolloContext } from "../../../apollo_server"

export const employerLoginMutation: GraphQLFieldConfig<any, any> = {
  type: EmployerAuthPayloadType,
  args: {
    input: { type: new GraphQLNonNull(EmployerLoginInputType) }
  },
  resolve: async (_source, args: { input: EmployerLoginInput }, context: ApolloContext, _info) : Promise<EmployerAuthPayload> => {
    try {
      const employer = await context.api.authenticationService.employer_login(args.input);
      const tokens = await context.jwt.generateTokens({id: employer.id});
      return {
        employer: employer,
        ...tokens
      }
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
}

export const employerRegisterMutation: GraphQLFieldConfig<any, any> = {
  type: EmployerType,
  args: {
    input: { type: new GraphQLNonNull(EmployerInputType) }
  },
  resolve: async (_source, args: { input: EmployerInput }, context: ApolloContext, _info) : Promise<Employer> => {
    try {
      return await context.api.employerService.create_employer(args.input);
    } catch(error) {
      throw context.api.handleError(error);
    }
  }
}

export const employerMutations = {
  "employerLogin": employerLoginMutation,
  "employerRegister": employerRegisterMutation,
}
