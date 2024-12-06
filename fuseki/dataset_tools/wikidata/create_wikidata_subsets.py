import requests


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


dataset = ""
class Dataset:
    def __init__(self):
        self.dataset = """
        @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
        @prefix wd:  <http://www.wikidata.org/entity/> .
        """
        self.professions()
        self.profession_labels()

    def professions(self):
        # Define the SPARQL query to get the label of a Developer
        professions_query = """
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
        """

        professions = query_wd(professions_query)
        for item in professions:
            self.dataset += f"<{item['subProfession']['value']}> wd:P279 <{item['profession']['value']}>.\n"

    def profession_labels(self):
        global dataset
        profession_labels_query = """
        SELECT ?profession ?professionLabel WHERE {
        ?profession wdt:P31 wd:Q28640.
        OPTIONAL {
            ?profession rdfs:label ?professionLabel. FILTER(LANG(?professionLabel) = "en")
        }
        }
        """
        labels = query_wd(profession_labels_query)
        for item in labels:
            if "professionLabel" in item.keys():
                self.dataset += f"<{item['profession']['value']}> rdfs:label \"{item['professionLabel']['value']}\".\n"


with open("wikidata_subsets.ttl", "w") as file:
    file.write(Dataset().dataset)
