import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { ApolloContext } from "../../apollo_server";
import { InvalidRoleError, UnAuthorizedFieldError } from "../../api/errors/authorization";
import { GQLTypes } from "../types";
import { Role } from "../types/role/types";

interface RoleDirective {
  role: Role
}

export const roleDirectiveTransformer = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD](fieldConfig, fieldName, typeName, schema) {
      const defaultResolver = fieldConfig.resolve || defaultFieldResolver;

      const directive = getDirective(schema, fieldConfig, 'role')?.[0] as RoleDirective;

      if(directive) {
        const { role } = directive;

        fieldConfig.resolve = async function (source, args, context: ApolloContext, info) {
          console.log("DIRECTIVE", context.userRole, role)

          if(context.userRole != role) {
            throw new InvalidRoleError({
              required: role.toString()
            });
          }

          return await defaultResolver(source, args, context, info);
        }
        return fieldConfig;
      }
      return fieldConfig;
    }
  });
}
