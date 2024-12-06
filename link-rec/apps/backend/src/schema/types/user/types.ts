import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Education, EducationType } from "../education";
import { ApolloContext } from "../../../apollo_server";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  webPage?: string | null;
  location?: string | null;
  bio?: string | null;
  education: Education[]
  connections: User[]
}

export interface AuthPayload {
  access: string,
  refresh: string,
  user: User
}

export const AuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
  name: "AuthPayload",
  fields: () => ({
    access: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: new GraphQLNonNull(GraphQLString) },
    user: { type: new GraphQLNonNull(UserType) },
  })
})

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
    education: {
      type: new GraphQLList(EducationType),
      resolve: (parent) => {
        // Implement education resolver

      }
    },
    connections: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context: ApolloContext, _info): Promise<User[]> => {
        // Implement education resolver
        return [
          {
            id: "usr_03HKPQ4V5N6W7X8Y9Z0",
            firstName: "Sofia",
            lastName: "Garcia",
            email: "sofia.garcia@example.com",
            phoneNumber: null,
            webPage: "https://sofiagarcia.io",
            location: null,
            bio: null,
            education: [],
            connections: [] // Will be populated later
          },
          {
            id: "usr_02HKPQ3W4M5X6Y7Z8A9",
            firstName: "James",
            lastName: "Chen",
            email: "james.chen@example.com",
            phoneNumber: "+1 (555) 234-5678",
            webPage: null,
            location: "Seattle, WA",
            bio: "Software architect with 10 years of experience",
            education: [],
            connections: [] // Will be populated later
          }
        ]
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
