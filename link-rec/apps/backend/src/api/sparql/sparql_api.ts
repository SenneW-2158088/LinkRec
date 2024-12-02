import { ParsingClient, SimpleClient } from "sparql-http-client"

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
}
