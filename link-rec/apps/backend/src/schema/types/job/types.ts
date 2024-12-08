import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Requirement, requirementInputType, requirementType, requirementUpdateType } from "../requirement/types";
import { Validation } from "../../../validation";

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
      type: new GraphQLList(new GraphQLNonNull(requirementType)),
      resolve: async (_source, args, context, _info) : Promise<Requirement[]>  => {
        console.log("using requirements")
        return []
      }
    },
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

export const JobUpdateType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "JobUpdate",
  fields: () => ({
    title: { type: GraphQLString },
    employer: { type: GraphQLString },
    location: { type: GraphQLString },
    description: { type: GraphQLString },
    requirements: {
      type: new GraphQLList(requirementUpdateType)
    },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    isActive: { type: GraphQLBoolean },
  })
})
