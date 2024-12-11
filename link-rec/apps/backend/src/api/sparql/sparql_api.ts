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
    console.log("====      query     ====")
    console.log(query)
    console.log("==== query finished ====")
    return await this.parser.query.select(query)
  }

  async update(query: string) {
    console.log("====      update     ====")
    console.log(query)
    console.log("==== update finished ====")
    await this.parser.query.update(query)
  }

  async resolve<T>(object: ParserType<T>): Promise<T> {
    const context: ResolverContext = {
      query: this.query.bind(this)
    }

    return await object.resolve(context, null)
  }
}
