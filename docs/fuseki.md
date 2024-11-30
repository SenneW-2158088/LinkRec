# Apache Jena Fuseki Lore

## Data loading
The /fuseki/staging folder can be used to load data into new in-memory databases. Adding a new rdf typeof file also needs to be referenced inside the compose.yaml.

Just add the following 2 lines for the new data file:
```sh
"--file=/staging/obese.rdf", # references the stagin file
"/test", # name of endpoint (database name)
```
