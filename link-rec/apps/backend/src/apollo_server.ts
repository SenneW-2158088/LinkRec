import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { linkRecSchema } from "./schema";
import { Database, DatabaseConfig } from "./db/database";
import { LinkRecAPI } from "./api";
import { SparqlAPI } from "./api/sparql/sparql_api";

const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'linkrec',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production',
};


const db = new Database(dbConfig);

export interface ApolloContext {
  api: LinkRecAPI
}


export function createApolloServer() {
  const server: ApolloServer<ApolloContext> = new ApolloServer({ schema: linkRecSchema });
  return server
}

export function createApolloContext() {
  return {
    context: async (): Promise<ApolloContext> => ({
      api: new LinkRecAPI({
        db: db,
        sparql: new SparqlAPI({
          updateUrl: "http://fuseki-dev:3030/linkrec/update",
          queryUrl: "http://fuseki-dev:3030/linkrec/query"
        })
      })
    })
  }
}
