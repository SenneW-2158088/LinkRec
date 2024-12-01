import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Education, EducationType } from "../education";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  webPage?: string;
  location?: string;
  bio?: string;
  education: Education[]
  connections: User[]
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
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
