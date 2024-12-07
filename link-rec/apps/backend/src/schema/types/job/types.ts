import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const JobType: GraphQLObjectType = new GraphQLObjectType({
  name: "JobInput",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    employer: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    requirements: { type: new GraphQLNonNull(
      new GraphQLList(GQLTypes.Requirement.Requirement)
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
