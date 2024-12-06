import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export interface Employer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  webPage?: string | null;
  location?: string | null;
}

export interface EmployerAuthPayload {
  employer: Employer,
  access: string,
  refresh: string,
}

export const EmployerAuthPayloadType: GraphQLObjectType = new GraphQLObjectType({
  name: "EmployerAuthPayload",
  fields: () => ({
    employer: { type: new GraphQLNonNull(EmployerType) },
    access: { type: new GraphQLNonNull(GraphQLString) },
    refresh: { type: new GraphQLNonNull(GraphQLString) },
  })
})

export const EmployerType: GraphQLObjectType = new GraphQLObjectType({
  name: "Employer",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
  })
});

export const EmployerLoginInputType = new GraphQLInputObjectType({
  name: "EmployerLoginInput",
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }
});

export const EmployerInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "EmployerInput" ,
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
  })
});
