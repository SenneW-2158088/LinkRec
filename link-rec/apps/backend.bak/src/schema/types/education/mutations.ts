import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Education, EducationInput, EducationInputType, EducationType } from "./types"

export const educationMutation: GraphQLFieldConfig<any, any> = {
  type: EducationType,
  args: {
    input: { type: new GraphQLNonNull(EducationInputType) }
  },
  resolve: async (_source, args: { input: EducationInput }, _context, _info) : Promise<Education> => {
    return {
      id: "1",
      institution: args.input.institution,
      degree: args.input.degree,
      startDate: args.input.startDate,
      endDate: args.input.endDate,
      fieldOfStudy: args.input.fieldOfStudy,
    }
  }
}

export const educationMutations = {
  "education": educationMutation,
}
