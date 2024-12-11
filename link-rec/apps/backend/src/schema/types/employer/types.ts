import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Job } from "../job";
import { JobType } from "../job/types";
import { ApolloContext } from "../../../apollo_server";

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
    jobs: {
      type: new GraphQLList(JobType),
      resolve: async (root: Employer, args, context: ApolloContext, fields) : Promise<Job.Type[]> => {
        try {
          return await context.api.employerService.getJobFor(root.id);
        }catch(error) {
          throw context.api.handleError(error);
        }
      }
    }
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
