import requests

wd_prefix = "http://www.wikidata.org/entity/"

def query_wd(query):
    url = "https://query.wikidata.org/sparql"

    params = {
        'query': query,
        'format': 'json'
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()['results']['bindings']
    else:
        raise Exception("Error:", response.status_code, response.text)

# Define the SPARQL query to get the label of a Developer
query = """
SELECT ?subProfession ?profession WHERE {
  ?subProfession wdt:P279 ?profession ;
            wdt:P31 wd:Q28640.
  OPTIONAL {
    ?profession wdt:P31 wd:Q28640.
  }
  OPTIONAL {
    ?profession rdfs:label ?jobLabel. FILTER(LANG(?jobLabel) = "en")
  }
}
ORDER BY ?profession
"""

dataset = ""

professions = query_wd(query)
for item in professions:
    print(item["subProfession"]["value"], " ", wd_prefix + "P279", " ", item["profession"]["value"] + ".")
    dataset += f"{item['subProfession']['value']} {wd_prefix}P279 {item['profession']['value']}.\n"

# TODO: Educations

print(dataset)
