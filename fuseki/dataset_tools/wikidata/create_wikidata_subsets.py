import requests


def query_wd(query):
    url = "https://query.wikidata.org/sparql"

    params = {"query": query, "format": "json"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()["results"]["bindings"]
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
        self.bachelor_degrees()
        self.master_degrees()

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
        ?profession wdt:P31 wd:Q28640 ;
                    rdfs:label ?professionLabel
                    FILTER(LANG(?professionLabel) = "en") .
        }
        """
        labels = query_wd(profession_labels_query)
        for item in labels:
            self.dataset += f"<{item['profession']['value']}> rdfs:label \"{item['professionLabel']['value']}\".\n"

    def master_degrees(self):
        global dataset
        master_degrees_query = """
        SELECT ?degree ?degreeLabel
        WHERE {
        ?degree wdt:P31 wd:Q183816 ;
            rdfs:label ?degreeLabel 
            FILTER(LANG(?degreeLabel) = "en") .
        }
        ORDER BY ?degreeLabel
        """
        master_degrees = query_wd(master_degrees_query)
        for item in master_degrees:
            self.dataset += f"<{item['degree']['value']}> wd:P31 wd:wd:Q183816 .\n"
            self.dataset += f"<{item['degree']['value']}> rdfs:label \"{item['degreeLabel']['value']}\".\n"

    def bachelor_degrees(self):
        global dataset
        bachelor_degrees_query = """
        SELECT ?degree ?degreeLabel
        WHERE {
        ?degree wdt:P31 wd:Q163727 ;
            rdfs:label ?degreeLabel 
            FILTER(LANG(?degreeLabel) = "en") .
        }
        ORDER BY ?degreeLabel
        """
        bachelor_degrees = query_wd(bachelor_degrees_query)
        for item in bachelor_degrees:
            self.dataset += f"<{item['degree']['value']}> wd:P31 wd:wd:Q253440 .\n"
            self.dataset += f"<{item['degree']['value']}> rdfs:label \"{item['degreeLabel']['value']}\".\n"


with open("wikidata_subsets.ttl", "w") as file:
    file.write(Dataset().dataset)
