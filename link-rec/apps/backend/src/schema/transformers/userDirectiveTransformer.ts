import { getDirective, getDirectives, MapperKind, mapSchema } from "@graphql-tools/utils"
import { defaultFieldResolver, GraphQLSchema } from "graphql"

export interface DirectiveExtensions {
  directives: {
    user?: Record<string, any>; // or define more specific type for directive args
  }
}

export const userDirectiveTransformer = (schema: GraphQLSchema) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD](fieldConfig, fieldName, typeName) {
      const directives = fieldConfig.extensions?.directives as DirectiveExtensions["directives"];
      const defaultResolver = fieldConfig.resolve || defaultFieldResolver;

      if(directives?.user) {
        fieldConfig.resolve = async function (source, args, context, info) {
          return defaultResolver(source, args, context, info);
        }
        return fieldConfig;
      }
      return fieldConfig;
    }
  });
}
