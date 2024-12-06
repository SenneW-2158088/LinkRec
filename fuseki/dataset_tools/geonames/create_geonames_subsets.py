import pandas as pd

# Load the TSV file into a DataFrame
file_path = 'BE.txt'  # Replace with your TSV file path
df = pd.read_csv(file_path, sep='\t', header=None)

# Define the column names based on the provided table
df.columns = [
    'geonameid', 'name', 'asciiname', 'alternatenames', 'latitude', 'longitude',
    'feature_class', 'feature_code', 'country_code', 'cc2', 'admin1_code',
    'admin2_code', 'admin3_code', 'admin4_code', 'population', 'elevation',
    'dem', 'timezone', 'modification_date'
]

filtered_df = df[df['feature_class'].isin(['A', 'P'])]

# Initialize the TTL output
ttl_output = []
ttl_output.append("@prefix location: <http://fuseki:8080/ontology/location/> .\n")
ttl_output.append("@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n")
ttl_output.append("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n")
# Define the base URI for the location
base_uri = "http://www.geonames.org/"

# Iterate through each row in the DataFrame
for index, row in filtered_df.iterrows():
    geonameid = row['geonameid']
    name = row['name']
    alternatenames = row['alternatenames'].split(',') if pd.notna(row['alternatenames']) else []

    # Add the main location entry
    ttl_output.append(f"<{base_uri}{geonameid}> rdf:type location:Location ;")
    ttl_output.append(f"    location:hasName \"{name}\" ;")

    # Add alternate names
    for alt_name in alternatenames:
        ttl_output.append(f"    location:hasAlternateName \"{alt_name.strip()}\" ;")

    # Close the entry
    ttl_output[-1] = ttl_output[-1].rstrip(" ;") + " .\n"  # Remove the last semicolon and add a period

# Write the TTL output to a file
with open('geonames_subsets.ttl', 'w', encoding='utf-8') as ttl_file:
    ttl_file.write("\n".join(ttl_output))

print("Geonames TTL file has been created successfully.")
