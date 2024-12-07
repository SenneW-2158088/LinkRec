import { GraphQLFieldConfig, GraphQLNonNull } from "graphql";
import { Authentication } from ".";
import { User } from "../user";
import { Employer } from "../employer";
import { Validation } from "../../../validation";
import { ApolloContext } from "../../../apollo_server";

export const userLoginMutation: GraphQLFieldConfig<any, any> = {
  type: Authentication.User,
  args: {
    input: { type: new GraphQLNonNull(User.Login) }
  },
  resolve: async (source, args: { input: Validation.User.Login }, context: ApolloContext, info): Promise<Authentication.UserType> => {
    try {
      const user = await context.api.authenticationService.user_login(args.input);
      const tokens = await context.jwt.generateTokens({id: user.id});
      return {
        user: user,
        ...tokens
      }
    } catch(error) {
      throw context.api.handleError(error)
    }
  }
}

export const userRegisterMutation: GraphQLFieldConfig<any, any> = {
  type: Authentication.User,
  args: {
    input: { type: new GraphQLNonNull(User.Register) }
  },
  resolve: async (_source, args: { input: Validation.User.Register }, context: ApolloContext, _info) : Promise<Authentication.UserType> => {
    return await context.api.userService.createUser(args.input);
  }
}

export const employerLoginMutation: GraphQLFieldConfig<any, any> = {
  type: Authentication.Employer,
  args: {
    input: { type: new GraphQLNonNull(Employer.Login) }
  },
  resolve: async (_source, args: { input: Validation.Employer.Login }, context: ApolloContext, _info) : Promise<Authentication.EmployerType> => {
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
  type: Authentication.Employer,
  args: {
    input: { type: new GraphQLNonNull(Employer.Register) }
  },
  resolve: async (_source, args: { input: Validation.Employer.Register }, context: ApolloContext, _info) : Promise<Authentication.EmployerType> => {
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
