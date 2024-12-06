import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { linkRecSchema } from "./schema";
import { Database, DatabaseConfig } from "./db/database";
import { LinkRecAPI } from "./api";
import { SparqlAPI } from "./api/sparql/sparql_api";
import { schemaTransform } from "./schema/transformers";
import { userDirectiveTransformer } from "./schema/transformers/userDirectiveTransformer";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { sign as signJwt, verify as verifyJwt } from "jsonwebtoken";
import { Request } from "express";
import { User } from "./schema/types";
import { jwtMiddleware } from "./middleware/jwtMiddleware";
import JwtService from "./jwt";

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'linkrec',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production',
};


const db = new Database(dbConfig);

export interface JwtPayload {
  id: string
}

export interface ApolloContext {
  api: LinkRecAPI,
  jwt: JwtService<JwtPayload>,
  userId?: string | null,
}

export function createApolloServer() {

  const schema = schemaTransform(linkRecSchema, [
    userDirectiveTransformer
  ]);

  return new ApolloServer<ApolloContext>({ schema: schema });
}

export function createApolloContext() {
  return {
    context: async ({req}: ExpressContextFunctionArgument): Promise<ApolloContext> => {
      let context: ApolloContext = {
        jwt: new JwtService(),
        api: new LinkRecAPI({
          db: db,
          sparql: new SparqlAPI({
            updateUrl: "http://fuseki-dev:3030/linkrec/update",
            queryUrl: "http://fuseki-dev:3030/linkrec/query"
          })
        })
      };

      await jwtMiddleware(context, req);

      return context
    }
  }
}
