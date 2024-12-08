import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Requirement, requirementInputType, requirementType } from "../requirement/types";

export const enum Level {
  ENTRY,
  MID,
  SENIOR,
  LEAD,
};

export interface Job {
  id: string,
  title: string,
  location: string
  active: boolean,
  requirements: Requirement[],
};

export const JobType: GraphQLObjectType = new GraphQLObjectType({
  name: "Job",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    requirements: {
      type: new GraphQLList(new GraphQLNonNull(requirementType))
    },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
  })
})

export const JobInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "JobInput",
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    requirements: {
      type: new GraphQLList(new GraphQLNonNull(requirementInputType))
    },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    isActive: { type: new GraphQLNonNull(GraphQLBoolean) },
  })
})
