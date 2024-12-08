import { ParsingClient, SimpleClient } from "sparql-http-client"
import { ParserType, ResolverContext } from "./sparql_parser"
import { Term } from "@rdfjs/types";

export type SparqlConfig = {
  updateUrl: string,
  queryUrl: string,
}

export class SparqlAPI {
  private parser: ParsingClient

  constructor(config: SparqlConfig) {
    const simpleClient = new SimpleClient({
      endpointUrl: config.queryUrl,
      updateUrl: config.updateUrl
    })
    this.parser = new ParsingClient(simpleClient)
  }

  async query(query: string) {
    return await this.parser.query.select(query)
  }

  async update(query: string) {
    await this.parser.query.update(query)
  }

  async resolve<T>(object: ParserType<T>): Promise<T> {
    const context: ResolverContext = {
      query: this.query.bind(this)
    }

    const node: Term = {
      termType: "NamedNode",
      value: `http://linkrec:8080/user/JohnDoe`,
      equals(other: Term) {
        return false;
      }
    }

    return await object.resolve(context, node)
  }
}
