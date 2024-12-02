import { ParsingClient, SimpleClient } from "sparql-http-client"

export type SparqlConfig = {
  endpointUrl: string,
}

export class SparqlAPI {
  private parser: ParsingClient

  constructor(config: SparqlConfig) {
    const simpleClient = new SimpleClient({endpointUrl: config.endpointUrl})
    this.parser = new ParsingClient(simpleClient)
  }

  async query(query: string) {
    return await this.parser.query.select(query)
  }

  async update(query: string) {
    await this.parser.query.update(query)
  }
}
