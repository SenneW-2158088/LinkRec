import { GraphQLID, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export const EducationType: GraphQLObjectType = new GraphQLObjectType({
  name: "Education",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    institution: { type: new GraphQLNonNull(GraphQLString) },
    degree: { type: new GraphQLNonNull(GraphQLString) },
    fieldOfStudy: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
  }),
});

export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export const EducationInputType: GraphQLInputObjectType  = new GraphQLInputObjectType({
  name: "EducationInput",
  fields: () => ({
    institution: { type: new GraphQLNonNull(GraphQLString) },
    degree: { type: new GraphQLNonNull(GraphQLString) },
    fieldOfStudy: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
  })
})
