import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { ApolloContext } from "../../../apollo_server"
import { Validation } from "../../../validation";
import { GQLTypes } from "..";

export const employerLoginMutation: GraphQLFieldConfig<any, any> = {
  type: GQLTypes.Authentication.Employer,
  args: {
    input: { type: new GraphQLNonNull(GQLTypes.Employer.Login) }
  },
  resolve: async (_source, args: { input: Validation.Employer.Login }, context: ApolloContext, _info) : Promise<GQLTypes.Authentication.EmployerType> => {
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
  type: GQLTypes.Authentication.Employer,
  args: {
    input: { type: new GraphQLNonNull(GQLTypes.Employer.Register) }
  },
  resolve: async (_source, args: { input: Validation.Employer.Register }, context: ApolloContext, _info) : Promise<GQLTypes.Authentication.EmployerType> => {
    try {
      const employer = await context.api.employerService.create_employer(args.input);
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

export const employerMutations = {
  "employerLogin": employerLoginMutation,
  "employerRegister": employerRegisterMutation,
}
