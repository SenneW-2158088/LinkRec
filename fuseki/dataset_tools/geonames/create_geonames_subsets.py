import pandas as pd
import pprint

# Load the TSV file into a DataFrame
file_path = '/Users/kobe/Documents/School/2024-2025/Web_Information_Systems/LinkRec/fuseki/dataset_tools/geonames/BE.txt'  # Replace with your TSV file path
df = pd.read_csv(file_path, sep='\t', header=None)

# Define the column names based on the provided table
df.columns = [
    'geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude',
    'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code',
    'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
    'dem', 'timezone', 'modification_date'
]

filtered_df = df[df['feature_class'].isin(['A'])]

# Initialize the TTL output
ttl_output = []
ttl_output.append("@prefix lr: <http://linkrec:8080/ontology/> .")
ttl_output.append("@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .")
ttl_output.append("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .")
# Define the base URI for the location
base_uri = "http://www.geonames.org/"

data = {}

# Iterate through each row in the DataFrame
for index, row in filtered_df.iterrows():
    geonameid = row['geonameid']
    name = row['name']
    # alternatenames = row['alternatenames'].split(',') if pd.notna(row['alternatenames']) else []
    amd1 = row['admin1_code']
    amd2 = row['admin2_code']
    amd3 = row['admin3_code']
    amd4 = row['admin4_code']
    feature_code = row['feature_code']

    if not feature_code in data:
        data[feature_code] = {}
    
    if feature_code == 'PCLI':
        data[feature_code][row['country_code']] = {
            "geonameid" : geonameid,
            "name" : name,
        }
    elif feature_code == 'ADM1':
        data[feature_code][row['admin1_code']] = {
            "geonameid" : geonameid,
            "name" : name,
            "country_code" : row['country_code'],
        }
    elif feature_code == 'ADM2':
        data[feature_code][row['admin2_code']] = {
            "geonameid" : geonameid,
            "name" : name,
            "admin1_code" : row['admin1_code'],
        }
    elif feature_code == 'ADM3':
        data[feature_code][row['admin3_code']] = {
            "geonameid" : geonameid,
            "name" : name,
            "admin2_code" : row['admin2_code'],
        }
    elif feature_code == 'ADM4':
        data[feature_code][row['admin4_code']] = {
            "geonameid" : geonameid,
            "name" : name,
            "admin3_code" : row['admin3_code'],
        }

# Add the main location entry for Belgium
ttl_output.append(f"<{base_uri}{data['PCLI']['BE']['geonameid']}> rdf:type lr:Location ;")
ttl_output.append(f"    lr:hasGeoName \"{data['PCLI']['BE']['name']}\" .")

for key, value in data['ADM1'].items():
    geonameid = value['geonameid']
    name = value['name']
    country_geonameid = data['PCLI'][value['country_code']]['geonameid']

    # Add the main location entry
    ttl_output.append(f"""<{base_uri}{geonameid}> rdf:type lr:Location ;
    lr:hasGeoName "{name}" ;
    lr:isPartOf <{base_uri}{country_geonameid}> .""")

for key, value in data['ADM2'].items():
    geonameid = value['geonameid']
    name = value['name']
    admin1_geonameid = data['ADM1'][value['admin1_code']]['geonameid']

    # Add the main location entry
    ttl_output.append(f"""<{base_uri}{geonameid}> rdf:type lr:Location ;
    lr:hasGeoName "{name}" ;
    lr:isPartOf <{base_uri}{admin1_geonameid}> .""")

for key, value in data['ADM3'].items():
    geonameid = value['geonameid']
    name = value['name']
    admin2_geonameid = data['ADM2'][value['admin2_code']]['geonameid']

    # Add the main location entry
    ttl_output.append(f"""<{base_uri}{geonameid}> rdf:type lr:Location ;
    lr:hasGeoName "{name}" ;
    lr:isPartOf <{base_uri}{admin2_geonameid}> .""")

for key, value in data['ADM4'].items():
    geonameid = value['geonameid']
    name = value['name']
    admin3_geonameid = data['ADM3'][value['admin3_code']]['geonameid']

    # Add the main location entry
    ttl_output.append(f"""<{base_uri}{geonameid}> rdf:type lr:Location ;
    lr:hasGeoName "{name}" ;
    lr:isPartOf <{base_uri}{admin3_geonameid}> .""")


# Write the TTL output to a file
with open('geonames_subsets.ttl', 'w', encoding='utf-8') as ttl_file:
    ttl_file.write("\n".join(ttl_output))

print("Geonames TTL file has been created successfully.")
