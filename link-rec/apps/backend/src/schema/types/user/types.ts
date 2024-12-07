import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ApolloContext } from "../../../apollo_server";
import { JobSeekingStatus, JobSeekingStatusType } from "../jobseeking";
import { GQLTypes } from "..";

export interface AuthPayload {
  access: string,
  refresh: string,
  user: GQLTypes.User.Type
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      extensions: { }
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      extensions: { directives: { user: { }, }, },
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
      // extensions: { directives: { user: {} } },
    },
    webPage: {
      type: GraphQLString
    },
    location: {
      type: GraphQLString,
      // extensions: { directives: { user: {} } },
    },
    bio: { type: GraphQLString },
    status: { type: new GraphQLNonNull(JobSeekingStatusType) },
    education: {
      type: new GraphQLList(EducationType),
      resolve: (parent) => {
        // Implement education resolver

      }
    },
    connections: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context: ApolloContext, _info): Promise<GQLTypes.User.Type[]> => {
        // Implement education resolver
        return []
      }
    },
  }),
});

export const LoginInputType = new GraphQLInputObjectType({
  name: "LoginInput",
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }
});

// Type for creating users
export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
    bio: { type: GraphQLString },
  },
});
