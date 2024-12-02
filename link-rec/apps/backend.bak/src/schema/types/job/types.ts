import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export interface Job {
  id: string,
  title: string,
  employer: string,
  location: string,
  description?: string,
  requirements: string[],
  startDate?: string,
  endDate?: string,
  isActive: boolean,
}

export const JobType: GraphQLObjectType = new GraphQLObjectType({
  name: "Job",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    requirements: { type: new GraphQLNonNull(
      new GraphQLList(GraphQLString)
    ) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
  })
})

export interface JobInput {
  title: string,
  employer: string,
  location: string,
  description?: string,
  requirements: string[],
  startDate?: string,
  endDate?: string,
  isActive: boolean,
}

export const JobInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "Job",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    requirements: { type: new GraphQLNonNull(
      new GraphQLList(GraphQLString)
    ) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
  })
})
