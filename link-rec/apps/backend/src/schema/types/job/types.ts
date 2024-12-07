import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Requirement } from "../requirement";

export const enum Level {
  ENTRY,
  MID,
  SENIOR,
  LEAD,
};

export interface Job {
  id: string,
  title: string,
  requirements: Requirement.Type[],
  location: string
  active: boolean,
};

export const JobType: GraphQLObjectType = new GraphQLObjectType({
  name: "JobInput",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    requirements: { type: new GraphQLNonNull(
      new GraphQLList(Requirement.Requirement)
    ) },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
  })
})

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
