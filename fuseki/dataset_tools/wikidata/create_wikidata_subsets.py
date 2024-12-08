import requests


def query_wd(query):
    url = "https://query.wikidata.org/sparql"

    params = {"query": query, "format": "json"}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()["results"]["bindings"]
    else:
        raise Exception("Error:", response.status_code, response.text)


class Dataset:
    def __init__(self):
        self.dataset = """
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix wd:  <http://www.wikidata.org/entity/> .

@prefix lr: <http://linkrec:8080/ontology/> .
"""
        self.professions()
        self.profession_labels()
        self.bachelor_degrees()
        self.master_degrees()
        self.languages()

    def professions(self):
        # Define the SPARQL query to get the label of a Developer
        professions_query = """
        SELECT ?subProfession ?profession WHERE {
            ?subProfession wdt:P279 ?profession ;
                        wdt:P31 wd:Q28640.
            OPTIONAL {
                ?profession wdt:P31 wd:Q28640.
            }
        }
        """

        professions = query_wd(professions_query)
        for item in professions:
            self.dataset += f"<{item['subProfession']['value']}> a lr:Profession ;\n"
            self.dataset += f"  wd:P279 <{item['profession']['value']}> .\n"

    def profession_labels(self):
        profession_labels_query = """
        SELECT ?profession ?professionLabel WHERE {
            ?profession wdt:P31 wd:Q28640 ;
                        rdfs:label ?professionLabel
                        FILTER(LANG(?professionLabel) = "en") .
        }
        """
        labels = query_wd(profession_labels_query)
        for item in labels:
            self.dataset += f"<{item['profession']['value']}> rdfs:label \"{item['professionLabel']['value'].lower()}\".\n"

    def master_degrees(self):
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
            self.dataset += f"<{item['degree']['value']}> wd:P31 wd:Q183816 ;\n"
            self.dataset += f"  rdfs:label \"{item['degreeLabel']['value'].lower()}\".\n"

    def bachelor_degrees(self):
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
            self.dataset += f"<{item['degree']['value']}> wd:P31 wd:Q253440 ;\n"
            self.dataset += f"  rdfs:label \"{item['degreeLabel']['value'].lower()}\".\n"

    def languages(self):
        languages_query = """
        SELECT ?language ?languageLabel
        WHERE {
        ?language wdt:P31 wd:Q33742 ;
            rdfs:label ?languageLabel
            FILTER(LANG(?languageLabel) = "en") .
        }
        ORDER BY ?languageLabel
        """
        languages = query_wd(languages_query)
        for item in languages:
            self.dataset += f"<{item['language']['value']}> rdf:type lr:Language ;\n"
            self.dataset += f"  rdfs:label \"{item['languageLabel']['value'].lower()}\".\n"


with open("wikidata_subsets.ttl", "w") as file:
    file.write(Dataset().dataset)
    print("Wikidata TTL File created successfully")
