import { ResultRow } from "sparql-http-client/ResultParser"

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
    this.addPrefix("rdfs", "<http://www.w3.org/2000/01/rdf-schema#>")

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


export class SparqlParser<T extends Object> {
  private values: {
    [key: string]: Set<unknown>
  } = {}

  private constructor(private rows: ResultRow[]) {
    for (const row of rows) {
      this.parseRow(row)
    }
  }

  private parseRow(row: ResultRow) {
    // keys: "email", "firstName"
    for (const key of Object.keys(row)) {
      if (row[key].termType === "Literal") {
        const value = row[key].value
        if (this.values[key]){
          this.values[key].add(value)
        } else {
          this.values[key] = new Set([value])
        }
      }
    }
  }

  static create<T extends object>(response: ResultRow[]): SparqlParser<T> {
    return new SparqlParser(response)
  }

  public parse(): T {
    const result: { [key: string]: unknown[] | unknown } = {}
    for (const key in this.values) {
      const value = this.values[key]
      if (value.size > 1 ) {
        result[key] = Array.from(value)
      }
      else {
        result[key] = Array.from(value)[0]
      }
    }

    return result
  }
}
