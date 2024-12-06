import { getDirective, getDirectives, MapperKind, mapSchema } from "@graphql-tools/utils"
import { defaultFieldResolver, GraphQLSchema } from "graphql"
import { ApolloContext } from "../../apollo_server";
import { User } from "../types";
import { UserNotFoundError } from "../../api/errors/userNotFoundError";
import { UnAuthorizedFieldError } from "../../api/errors/unAuthorizedFieldError";

export interface DirectiveExtensions {
  directives: {
    user?: Record<string, any>; // or define more specific type for directive args
  }
}

export const userDirectiveTransformer = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD](fieldConfig, fieldName, typeName, schema) {
      const directives = fieldConfig.extensions?.directives as DirectiveExtensions["directives"];
      const defaultResolver = fieldConfig.resolve || defaultFieldResolver;

      if(directives?.user) {
        fieldConfig.resolve = async function (source, args, context: ApolloContext, info) {
          if (typeName != "User") return fieldConfig;
          if(!context.userId){ throw new UserNotFoundError("jwt"); }

          const result = await defaultResolver(source, args, context, info);

          const parentUser = source as User;
          if(parentUser.id == context.userId) {
            return result
          }

          throw new UnAuthorizedFieldError();

        }
        return fieldConfig;
      }
      return fieldConfig;
    }
  });
}
