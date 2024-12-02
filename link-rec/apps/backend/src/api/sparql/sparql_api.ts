import { ParsingClient, SimpleClient } from "sparql-http-client"

export type SparqlConfig = {
  updateUrl: string,
  queryUrl: string,
}

export class SparqlAPI {
  private updateParser: ParsingClient
  private queryParser: ParsingClient

  constructor(config: SparqlConfig) {
    const simpleUpdateClient = new SimpleClient({endpointUrl: config.updateUrl})
    const simpleQueryClient = new SimpleClient({endpointUrl: config.queryUrl})
    this.updateParser = new ParsingClient(simpleUpdateClient)
    this.queryParser = new ParsingClient(simpleQueryClient)
  }

  async query(query: string) {
    return await this.queryParser.query.select(query)
  }

  async update(query: string) {
    await this.updateParser.query.update(query)
  }
}
