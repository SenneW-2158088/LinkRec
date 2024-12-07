export class SparqlBuilder {
  private prefixes: string[] = []

  constructor() {
  }

  static defaultPrefixes() {
    return new SparqlBuilder().defaultPrefixes()
  }

  private defaultPrefixes() {
    this.addPrefix("rdf", "<http://www.w3.org/1999/02/22-rdf-syntax-ns#>")
    this.addPrefix("owl","<http://www.w3.org/2002/07/owl#>")
    this.addPrefix("foaf","<http://xmlns.com/foaf/0.1/>")

    this.addPrefix("lr","<http://linkrec:8080/ontology/>")
    this.addPrefix("user", "<http://linkrec:8080/user/>")
    this.addPrefix("experience", "<http://linkrec:8080/experience/>")
    this.addPrefix("requirement", "<http://linkrec:8080/requirement/>")
    this.addPrefix("education", "<http://linkrec:8080/education/>")
    this.addPrefix("job", "<http://linkrec:8080/job/>")
    this.addPrefix("employer", "<http://linkrec:8080/employer/>")

    return this
  }

  addPrefix(prefix: string, uri: string) {
    this.prefixes.push(`PREFIX ${prefix}: ${uri}`)
    return this
  }


  build(query: string) {
    return `${this.prefixes.join("\n")}\n${query}`
  }
}

export class SparqlFieldBuilder {
  private constructor(private fields: string[]) {

  }
  static fromFields(...fields: string[]) {
    return new SparqlFieldBuilder(fields)
  }

  public field(field: string) {
    this.fields.push(field)
  }

  public build() {
    return this.fields.join(" ;\n") + "."
  }
}
