import { GraphQLFieldConfig, GraphQLNonNull } from "graphql"
import { Experience, ExperienceInput, ExperienceInputType, ExperienceType } from "./types"

export const experienceMutation: GraphQLFieldConfig<any, any> = {
  type: ExperienceType,
  args: {
    input: { type: new GraphQLNonNull(ExperienceInputType) }
  },
  resolve: async (_source, args: { input: ExperienceInput }, _context, _info) : Promise<Experience> => {
    return {
      id: "1",
      title: "",
      company: "",
    }
  }
}

export const experienceMutations = {
  "experience": experienceMutation,
}
