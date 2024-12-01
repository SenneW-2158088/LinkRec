import { GraphQLEnumType, GraphQLObjectType } from "graphql";

export enum JobSeekingStatus {
  ACTIVELY_LOOKING,
  OPEN_TO_OFFERS,
  NOT_LOOKING,
}

export const JobSeekingStatusType: GraphQLEnumType = new GraphQLEnumType({
  name: "JobSeekingStatus",
  values: {
    ACTIVELY_LOOKING: { value: 0 },
    OPEN_TO_OFFERS: { value: 1 },
    NOT_LOOKING: { value: 2 },
  }
});
