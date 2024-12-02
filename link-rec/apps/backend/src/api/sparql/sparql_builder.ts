export class SparqlBuilder {
  private prefixes: string[] = []

  constructor() {
  }

  static defaultPrefixes() {
    return new SparqlBuilder().defaultPrefixes()
  }

  private defaultPrefixes() {
    this.addPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
    this.addPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#")
    this.addPrefix("owl","<http://www.w3.org/2002/07/owl#>")
    this.addPrefix("rdf","<http://www.w3.org/1999/02/22-rdf-syntax-ns#>")
    this.addPrefix("foaf","<http://xmlns.com/foaf/0.1/>")

    this.addPrefix("linkrec_user","<http://linkrec:8080/users/>")
    this.addPrefix("linkrec","<http://linkrec:8080/>")
    this.addPrefix("lro","<#>") // empty prefix for the LinkRec ontology
    return this
  }

  addPrefix(prefix: string, uri: string) {
    this.prefixes.push(`PREFIX ${prefix}: <${uri}>`)
    return this
  }


  build(query: string) {
    return `${this.prefixes.join("\n")}\n${query}`
  }
}
