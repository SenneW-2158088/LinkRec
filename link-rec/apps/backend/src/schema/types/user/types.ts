import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Education, EducationType } from "../education";

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

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
      extensions: {
        directives: { user: {} }
      },
    },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
    bio: { type: GraphQLString },
    education: {
      type: new GraphQLList(EducationType),
      resolve: (parent) => {
        // Implement education resolver
      }
    },
    connections: {
      type: new GraphQLList(UserType),
      resolve: (parent) => {
        // Implement education resolver
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
