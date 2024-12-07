import { GraphQLEnumType, GraphQLObjectType } from "graphql";

export enum JobSeekingStatus {
  ACTIVELY_LOOKING = "ACTIVELY_LOOKING",
  OPEN_TO_OFFERS= "OPEN_TO_OFFERS",
  NOT_LOOKING = "NOT_LOOKING",
}

export const jobSeekingStatusToString = (status: JobSeekingStatus) => {
  switch(status) {
      case JobSeekingStatus.ACTIVELY_LOOKING:
        return "ActivelyLooking";
      case JobSeekingStatus.OPEN_TO_OFFERS:
        return "OpenToOffers";
      case JobSeekingStatus.NOT_LOOKING:
        return "NotLooking";
      default:
       throw Error("Doesn't match any job seeking status")
    }
}

export const jobSeekingStatusFromString = (status: string) => {
  switch(status) {
    case "ActivelyLooking":
        return JobSeekingStatus.ACTIVELY_LOOKING
    case "OpenToOffers":
      return JobSeekingStatus.OPEN_TO_OFFERS
    case "NotLooking":
      return JobSeekingStatus.NOT_LOOKING
    default:
       throw Error("Doesn't match any job seeking status string")
  }
}

export const JobSeekingStatusType: GraphQLEnumType = new GraphQLEnumType({
  name: "JobSeekingStatus",
  values: {
    ACTIVELY_LOOKING: { value: JobSeekingStatus.ACTIVELY_LOOKING },
    OPEN_TO_OFFERS: { value: JobSeekingStatus.OPEN_TO_OFFERS },
    NOT_LOOKING: { value: JobSeekingStatus.NOT_LOOKING },
  }
});
