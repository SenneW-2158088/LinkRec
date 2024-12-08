import { GraphQLEnumType, GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { ApolloContext } from "../../../apollo_server";
import { Education } from "../education";
import { JobSeekingStatus, JobSeekingStatusType } from "../jobseeking/types";
import { Experience } from "../experience";
import { GQLTypes } from "..";
import { EducationInput } from "../education/types";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  webPage?: string | null;
  status: JobSeekingStatus,
  location?: string | null;
  bio?: string | null;
  languages: string[];
  experiences: Experience.Type[],
  educations: Education.Type[]
  connections: GQLTypes.Connection.Type[]
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
      id: { type: GraphQLID, },
      firstName: { type: new GraphQLNonNull(GraphQLString), },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
        extensions: { directives: { user: {}, }, },
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
        extensions: { directives: { user: {}, }, },
      },
      phoneNumber: {
        type: new GraphQLNonNull(GraphQLString),
        extensions: { directives: { user: {} } },
      },
      webPage: {
        type: GraphQLString
      },
      location: {
        type: GraphQLString,
        // extensions: { directives: { user: {} } },
      },
      bio: { type: GraphQLString },
      status: { type: new GraphQLNonNull(JobSeekingStatusType) },
      languages: {
        type: new GraphQLList(GraphQLString)
      },
      education: {
        type: new GraphQLList(Education.Education),
        resolve: async (parent: User, _args, context: ApolloContext, _info) => {
          try {
            return context.api.userService.getUserEducations(parent.id);
          } catch (error) {
            throw context.api.handleError(error)
          }
        }
      },
      experiences: {
        type: new GraphQLList(Experience.Experience),
        resolve: async (parent: User, _args, context: ApolloContext, _info) => {
          try {
            return context.api.userService.getUserExperiences(parent.id);
          } catch (error) {
            throw context.api.handleError(error)
          }
        }
      },
      connections: {
        type: new GraphQLList(ConnectionType),
        resolve: async (parent: User, _args, context: ApolloContext, _info): Promise<Connection[]> => {
          try {
            return context.api.userService.getUserConnections(parent.id);
          } catch (error) {
            throw context.api.handleError(error)
          }
        }
      },
    };
  }
});


export enum Status {
  CONNECTED = "CONNECTED",
  PENDING = "PENDING",
  RECEIVING = "RECEIVING"
};

export function statusToString(status: Status): string {
  switch (status) {
    case Status.CONNECTED:
      return "CONNECTED";
    case Status.PENDING:
      return "PENDING";
    case Status.RECEIVING:
      return "RECEIVING";
    default:
      throw new Error("Invalid status");
  }
}

export function statusFromString(status: string): Status {
  switch (status) {
    case "CONNECTED":
      return Status.CONNECTED;
    case "PENDING":
      return Status.PENDING;
    case "RECEIVING":
      return Status.RECEIVING;
    default:
      throw new Error("Invalid status string");
  }
}

export interface Connection {
  user: User,
  status: Status,
};

export const ConnectionStatusType = new GraphQLEnumType({
  name: "ConnectionStatus",
  values: {
    CONNECTED: { value: "CONNECTED" },
    PENDING: { value: "PENDING" },
    RECEIVING: { value: "RECEIVING" },
  }
})

export const ConnectionType = new GraphQLObjectType({
  name: "Connection",
  fields: {
    user: { type: new GraphQLNonNull(UserType) },
    status: { type: new GraphQLNonNull(ConnectionStatusType) }
  }
})

export const LoginInputType = new GraphQLInputObjectType({
  name: "LoginInput",
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }
});

// Type for creating users
export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    webPage: { type: GraphQLString },
    location: { type: GraphQLString },
    bio: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    education: { type: new GraphQLList(Education.Create) },
    experiences: { type: new GraphQLList(Experience.Create) },
    languages: { type: new GraphQLList(GraphQLString) },
  },
});

export type UserInput = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string,
  webPage: string | null,
  location: string | null,
  bio: string | null,
  status: string,
  education: EducationInput[],
  languages: string[],
}

export type RequestConnectionInput = {
  userId: string
}

export const RequestConnectionInputType = new GraphQLInputObjectType({
    name: 'RequestConnectionInput',
    fields: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
    }
})
