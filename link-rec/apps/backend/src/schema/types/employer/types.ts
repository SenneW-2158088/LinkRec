import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Job } from "../job";

export interface Employer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  webPage?: string | null;
  jobs: Job.Type[];
}

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
