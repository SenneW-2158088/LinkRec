

async function getAll() {
  const fusekiEndpoint = 'http://localhost:3030/linkrec/query'; // Replace with your Fuseki endpoint
  const query = `
      SELECT ?subject ?predicate ?object
      WHERE {
          ?subject ?predicate ?object
      }
      LIMIT 25
  `;

  const response = await fetch(fusekiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/sparql-query',
      },
      body: query,
  });

  if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
  }

  const results = await response.json();
  console.log(results.results.bindings);
}

async function getConnections() {
  const fusekiEndpoint = 'http://localhost:3030/linkrec/query'; // Replace with your Fuseki endpoint
  const query = `
    PREFIX lro:     <#> # empty prefix for the LinkRec ontology
    PREFIX linkrec: <http://linkrec:8080/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?connectedUser
    WHERE {
        linkrec:User1 lro:Connection ?connectedUser .
    }
  `;

  const response = await fetch(fusekiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/sparql-query',
      },
      body: query,
  });

  if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
  }

  const results = await response.json();
  console.log("CONNECTIONS", results.results.bindings);
}

async function insertUser() {
  const fusekiEndpoint = 'http://localhost:3030/linkrec/update'; // Replace with your Fuseki endpoint
  const update = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX linkrec: <http://linkrec:8080/>
    PREFIX lro:     <#> # empty prefix for the LinkRec ontology

    INSERT DATA {
        linkrec:User1 a lro:User ;
                   foaf:name "Alice2" ;
                   lro:Connection linkrec:User2 .

        linkrec:User2 a lro:User ;
                   foaf:name "Bob2" .
    }
  `;

  const response = await fetch(fusekiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/sparql-update',
      },
      body: update,
  });

  if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
  }

  console.log("RESPONSE UPDATE", response)
  // const results = await response.json();
  // console.log(results.results.bindings);
}


async function run(){
  await insertUser()
  await getConnections()
  await getAll()
}

run()