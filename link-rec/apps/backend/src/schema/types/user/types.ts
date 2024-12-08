import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ApolloContext } from "../../../apollo_server";
import { Education } from "../education";
import { JobSeekingStatus, JobSeekingStatusType } from "../jobseeking/types";
import { Experience } from "../experience";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  webPage?: string | null;
  status: JobSeekingStatus,
  location?: string | null;
  bio?: string | null;
  languages: string[];
  experiences: Experience.Type[],
  educations: Education.Type[]
  connections: User[]
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID, },
    firstName: { type: new GraphQLNonNull(GraphQLString), },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
      extensions: { directives: { user: { }, }, },
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      extensions: { directives: { user: { }, }, },
    },
    phoneNumber: {
      type: new GraphQLNonNull(GraphQLString),
      extensions: { directives: { user: {} } },
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
    languages: {
      type: new GraphQLList(GraphQLString)
    },
    education: {
      type: new GraphQLList(Education.Education),
      resolve: async (parent: User, _args, context: ApolloContext, _info) => {
        try {
          return context.api.userService.getUserEducations(parent.id);
        } catch(error) {
          throw context.api.handleError(error)
        }
      }
    },
    experiences: {
      type: new GraphQLList(Experience.Experience),
      resolve: async (parent: User, _args, context: ApolloContext, _info) => {
        try {
          return context.api.userService.getUserExperiences(parent.id);
        } catch(error) {
          throw context.api.handleError(error)
        }
      }
    },
    connections: {
      type: new GraphQLList(UserType),
      resolve: async (parent: User, _args, context: ApolloContext, _info): Promise<User[]> => {
        try {
          return context.api.userService.getUserConnections(parent.id);
        } catch(error) {
          throw context.api.handleError(error)
        }
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
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
    bio: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    education: { type: new GraphQLList(Education.Create) },
  },
});
