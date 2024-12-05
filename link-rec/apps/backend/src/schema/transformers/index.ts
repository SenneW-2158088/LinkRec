import { GraphQLSchema } from "graphql"

type SchemaTransformer = (schema: GraphQLSchema) => GraphQLSchema;

export const schemaTransform = (
  schema: GraphQLSchema,
  transformers: SchemaTransformer[]
): GraphQLSchema => {

  if (!schema) {
    throw new Error('Schema is required');
  }

  if (!Array.isArray(transformers)) {
    throw new Error('Transformers must be an array');
  }

  return transformers.reduce((currentSchema, transformer) => {
    if (typeof transformer !== 'function') {
      throw new Error('Each transformer must be a function');
    }

    try {
      return transformer(currentSchema);
    } catch (error) {
      throw new Error(
        `Schema transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }, schema);
};
