import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export interface Employer {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
}

export const EmployerType: GraphQLObjectType = new GraphQLObjectType({
  name: "Employer",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  })
});
