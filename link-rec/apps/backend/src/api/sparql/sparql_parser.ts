import { Term } from "@rdfjs/types";
import { resolve } from "node:path/posix";
import { ResultRow } from "sparql-http-client/ResultParser";

// Context passed through the structure
export interface ResolverContext {
  query: (query: string) => Promise<ResultRow[]>;
}

// A primitive base type
export interface ParserType<TResult = any> {
  resolve: (context: ResolverContext, term: any) => Promise<TResult>;
}

// Basic scalar types
export const StringType: ParserType<string> = {
  resolve: async (_context: ResolverContext, term: Term) => {
    if (term.termType === "Literal") {
      return term.value;
    }
    throw Error("Term is not a Literal");
  }
};

export const IntegerType: ParserType<number> = {
  resolve: async (_context: ResolverContext, term: Term) => {
    if (term.termType === "Literal") {
      return parseInt(term.value);
    }
    throw Error("Term is not a Literal");
  }
};


// List type wrapper
export const ListType = <T>(itemType: ParserType<T>): ParserType<T[]> => ({
  resolve: async (context: ResolverContext, term: Term) => {
    // If the term is a comma-separated list
    if (term.termType === "Literal") {
      const values = term.value.split(',').filter(Boolean);
      return Promise.all(
        values.map(value =>
          itemType.resolve(context, { termType: "Literal", value } as Term)
        )
      );
    }
    else {
      throw Error("Not a list of literals")
    }
  }
});

export interface ObjectTypeConfig<T> {
  query: (uri: string) => string;
  fields: {
    [K in keyof T]: ObjectTypeField<T[K]>;
  };
}

export interface ObjectTypeField<T> {
  type: ParserType<T>;
  predicate?: string;
  resolve?: (term: Term, context: ResolverContext) => Promise<T>;
}

export function ObjectType<T>(config: ObjectTypeConfig<T>): ParserType<T> {
  return {
    resolve: async (context: ResolverContext, term: Term) => {
      const rows = await context.query(config.query(term.value))
      const row = rows[0];
      const result = {} as T;

      // Type-safe iteration over fields
      const entries = Object.entries(config.fields) as [keyof T, ObjectTypeField<T[keyof T]>][];

      for (const [fieldName, field] of entries) {
        console.log("fieldname", fieldName)
        const term = row[fieldName as string] || null;
        result[fieldName] = await field.type.resolve(context, term);
      }

      return result;
    }
  };
}

export const OptionalType = <T>(parser: ParserType<T>): ParserType<T | null> => ({
  async resolve(context: ResolverContext, term: Term | null) {
    if (term) {
      return await parser.resolve(context, term);
    }
    return null
  }
})

export function ObjectListType<T>(config: ObjectTypeConfig<T>): ParserType<T[]> {
  return {
    resolve: async (context: ResolverContext, term: Term) => {
      const uris = term.value.split(',')
      const results: T[] = []
      for (const uri of uris) {
        const rows = await context.query(config.query(uri))

        const entries = Object.entries(config.fields) as [keyof T, ObjectTypeField<T[keyof T]>][];

        for (const row of rows) {
          const result = {} as T;

          for (const [fieldName, field] of entries) {
            const term = row[fieldName as string] || null;
            console.log(fieldName, "term", term)
            result[fieldName] = await field.type.resolve(context, term);
          }
          results.push(result)
        }
      }

      return results;
    }
  };
}

interface User {
  name: string;
  educations: Education[];
}

interface Education{}
