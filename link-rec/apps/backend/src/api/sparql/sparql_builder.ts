import { ResultRow } from "sparql-http-client/ResultParser"
import { Term } from "@rdfjs/types";

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
  private separator = " ;\n"
  constructor(private fields: string[]) {

  }
  static fromFields(...fields: string[]) {
    return new SparqlFieldBuilder(fields)
  }

  static create() {
    return new SparqlFieldBuilder([]);
  }

  public field(field: string) {
    this.fields.push(field)
  }

  public hasFields() {
    return this.fields.length > 0;
  }

  public build() {
    return this.fields.join(this.separator) + "."
  }

  public setSeparator(separator: string) {
    this.separator = separator
    return this
  }
}

type ParserType = {
  resolve: (terms: Term[]) => any
}


// Object(ResultRow[]) {

// }
// userResolver
// {
//   firstname -> StringType(ResultRow[])
//   lastname
//   educations: [] -> Own type
// }
// [
//
// StringType("firstname")
// Builder({
//  firstName: StringType
// })
// backend-dev-1  |   {
// backend-dev-1  |     firstName: Literal { value: 'bugo', language: '', datatype: [NamedNode] },
// backend-dev-1  |     lastName: Literal { value: 'janssen', language: '', datatype: [NamedNode] },
// backend-dev-1  |     email: Literal { value: 'asdfadsf', language: '', datatype: [NamedNode] }
// backend-dev-1  |     education: NamedNode { value: 'asdfadsf', language: '', datatype: [NamedNode] }
// backend-dev-1  |   },
// backend-dev-1  |   {
// backend-dev-1  |     firstName: Literal { value: 'bugo', language: '', datatype: [NamedNode] },
// backend-dev-1  |     lastName: Literal { value: 'janssen', language: '', datatype: [NamedNode] },
// backend-dev-1  |     email: Literal {
// backend-dev-1  |       value: 'asdddddddf',
// backend-dev-1  |       language: '',
// backend-dev-1  |       datatype: [NamedNode]
// backend-dev-1  |     }
// backend-dev-1  |   },
// backend-dev-1  |   {
// backend-dev-1  |     firstName: Literal { value: 'bugo', language: '', datatype: [NamedNode] },
// backend-dev-1  |     lastName: Literal { value: 'janssen', language: '', datatype: [NamedNode] },
// backend-dev-1  |     email: Literal { value: 'ddddd', language: '', datatype: [NamedNode] }
// backend-dev-1  |   }
// backend-dev-1  | ]

const StringType: ParserType = {
  resolve: (terms: Term[]) => {
    if (terms.length === 0) {
      throw Error("Not enough terms to make string")
    }
    const term = terms[0]
    if (term.termType === "Literal") {
      return term.value
    }
  }
}
const ListType: ParserType = {
  resolve: (terms: Term[]) => {
    const resolved = []
    for (const term of terms) {
      if (term.termType === "Literal") {
        resolved.push(term.value)
      }
    }
    return resolved
  }
}




const ObjectType = (resolve) : ParserType => ({
  resolve
})

export class SparqlParser<T extends Object> {
  private values: {
    [key: string]: Set<unknown>
  } = {}

  constructor(private rows: ResultRow[], ) {
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
